package handlers

import (
	//"github.com/zenazn/goji/web"
	//"encoding/json"
	"fmt"
	"github.com/dtannen/engage/repository"
	"golang.org/x/net/websocket"
	"html/template"
	"log"
	"net/http"
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
		/*
			fmt.Println("Received data:")
			fmt.Println("Scroll depth: " + d.ScrollDepth)
			fmt.Println("Scroll velocity: " + d.ScrollVelocity)
			fmt.Println("Time on page: " + d.TimeOnPage)
			fmt.Println("---------------------------------")
		*/
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

	for _, v := range dataList {
		err := repository.SaveReport(v)
		if err != nil {
			log.Fatal("Error: repository.SaveReport(r) | %v\n", err)
		}
	}

	fmt.Println("Connection is closed.")
	// TODO: Save data to database
}
