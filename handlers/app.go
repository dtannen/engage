package handlers

import (
	//"github.com/zenazn/goji/web"
	//"encoding/json"
	"encoding/json"
	"fmt"
	"github.com/dtannen/engage/repository"
	"golang.org/x/net/websocket"
	"html/template"
	"log"
	"net/http"
	"time"
)

func AppHandler(w http.ResponseWriter, r *http.Request) {

	// Compile template
	t, err := template.ParseFiles(
		"templates/_base.html",
		"templates/index.html")
	if err != nil {
		log.Printf("Error: AppHandler | template.ParseFiles() | %v", err)
	}

	// Serve template to client
	err = t.Execute(w, nil)
	if err != nil {
		log.Printf("Error: AppHandler | t.Execute(w, nil): %#v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func WSHandler(ws *websocket.Conn) {

	dataList := []repository.ScrollDepthReport{}

	start := time.Now()

	for {

		d := repository.ScrollDepthData{}

		err := websocket.JSON.Receive(ws, &d)
		if err != nil {
			fmt.Println("Can't receive: " + err.Error())
			break
		}

		r := repository.ScrollDepthReport{
			AccountID:    "xyz",
			CampaignID:   "xyz",
			CreativeIS:   "abc",
			ImpressionID: "123abc",
			Data:         d,
		}

		dataList = append(dataList, r)

		// TODO: Append ScrollDepth object to dataList and save it to database on websocket connection close

		fmt.Printf("Received data: \n")
		fmt.Printf("%d\n", d.ScrollDepth)
		fmt.Printf("%d\n", d.ScrollVelocity)
		fmt.Printf("%d\n", d.DwellTime)
		fmt.Printf("---------------------------------")

		/*
			msg := "Received:  " + reply
			fmt.Println("Sending to client: " + msg)

			err = websocket.Message.Send(ws, msg)
			if err != nil {
				fmt.Println("Can't send")
				break
			}
		*/
	}

	elapsed := time.Since(start)
	elapsedString := fmt.Sprintf("%v", int(elapsed.Seconds()))
	log.Printf("Time on page: %v\n", elapsedString)

	report := repository.ScrollDepthReport{}

	maxScrollDepth := 0
	averageScrollvelocity := 1
	totalScrollvelocity := 0
	counter := 1
	maxDwellTime := 0

	for _, v := range dataList {
		if v.Data.ScrollDepth > maxScrollDepth {
			maxScrollDepth = v.Data.ScrollDepth
		}

		if v.Data.DwellTime > maxDwellTime {
			maxDwellTime = v.Data.DwellTime
		}

		counter += 1
		totalScrollvelocity += v.Data.ScrollVelocity
	}

	averageScrollvelocity = totalScrollvelocity / counter
	log.Printf("Average scroll velocity: %v\n", averageScrollvelocity)

	report.AccountID = "xyz"
	report.CampaignID = "xyz"
	report.CreativeIS = "abc"
	report.ImpressionID = "123abc"
	report.Data.ScrollDepth = maxScrollDepth
	report.Data.ScrollVelocity = averageScrollvelocity
	report.Data.DwellTime = maxDwellTime
	report.Data.TimeOnPage = int(elapsed.Seconds())

	err := repository.SaveReport(report)
	if err != nil {
		log.Fatal("Error: repository.SaveReport(r) | %v\n", err)
	}

	fmt.Println("Connection is closed.")
	// TODO: Save data to database
}

func GetData(w http.ResponseWriter, r *http.Request) {
	// Send JSON to Client
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)

	// Get Data from Database
	reports, err := repository.GetAllReports()
	if err != nil {
		log.Fatalf("Error: repository.GetAllReports() | %v\n", err)
		return
	}

	err = json.NewEncoder(w).Encode(&reports)
	if err != nil {
		log.Printf("Error: json.NewEncoder(w).Encode(&reports): %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}
