package main

import (
	"github.com/dtannen/engage/handlers"
	"github.com/zenazn/goji"
	"net/http"
)

func main() {
	// HTTP Routing
	setupRouting()
}

func setupRouting() {
	goji.Get("/", handlers.AppHandler)

	// Static file serving
	goji.Get("/static/*", http.StripPrefix("/static", http.FileServer(http.Dir("static"))))

	goji.Serve()
}
