package handlers

import (
	//"github.com/zenazn/goji/web"
	"fmt"
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
	for {
		var reply string

		err := websocket.Message.Receive(ws, &reply)
		if err != nil {
			fmt.Println("Can't receive")
			break
		}

		fmt.Println("Received back from client: " + reply)

		msg := "Received:  " + reply
		fmt.Println("Sending to client: " + msg)

		err = websocket.Message.Send(ws, msg)
		if err != nil {
			fmt.Println("Can't send")
			break
		}
	}
}
