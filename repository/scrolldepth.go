package repository

import (
	"gopkg.in/mgo.v2"
	//"gopkg.in/mgo.v2/bson"
	"log"
	//"os"
)

type ScrollDepthData struct {
	ScrollDepth    string `json:"scroll_depth"    bson:"scroll_depth"`
	ScrollVelocity string `json:"scroll_velocity" bson:"scroll_velocity"`
	TimeOnPage     string `json:"time_on_page"    bson:"time_on_page"`
	DwellTime      string `json:"dwell_time"      bson:"dwell_time"`
}

type ScrollDepthReport struct {
	AccountID    string          `json:"account_id"    bson:"account_id"`
	CampaignID   string          `json:"campaign_id"   bson:"campaign_id"`
	CreativeIS   string          `json:"creative_id"   bson:"creative_id"`
	ImpressionID string          `json:"impression_id" bson:"impression_id"`
	Data         ScrollDepthData `json:"data"          bson:"data"`
}

func SaveReport(report ScrollDepthReport) error {

	session, err := mgo.Dial("mongodb://localhost")
	if err != nil {
		log.Fatalf("Cant connect to mongo.\n")
		return err
	}
	defer session.Close()

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	reportCollection := session.DB("reports").C("scroll_reports")
	err = reportCollection.Insert(report)
	if err != nil {
		log.Fatalf("reportCollection.Insert(report)\n")
		return err
	}

	log.Println("Saved to database")

	return nil
}
