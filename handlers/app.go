package handlers

import (
	//"github.com/zenazn/goji/web"
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
