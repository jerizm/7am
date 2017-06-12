package main

import (
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jasonlvhit/gocron"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"regexp"
	"time"
)

var config *ServerConfig

func main() {
	var err error
	config, err = ReadConfig("config.yml")
	if err != nil {
		log.Fatal(err)
	}

	GetNews()
	gocron.Every(5).Minutes().Do(GetNews)

	go gocron.Start()

	r := mux.NewRouter()
	r.HandleFunc("/", RssHandler).
		Methods("GET")
	http.Handle("/", r)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func RssHandler(w http.ResponseWriter, r *http.Request) {
	cache, err := ioutil.ReadFile(config.CacheFile)
	check(err)

	w.Header().Set("Cache-Control", "max-age=0")
	w.Header().Set("Expires", time.Now().Format(http.TimeFormat))
	fmt.Fprintf(w, string(cache))
}

func GetNews() {
	log.Print("getting news")
	if GetEst().Hour() != 7 {
		return
	}
	resp, err := http.Get(config.NewsUrl)
	check(err)
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	check(err)

	match, err := regexp.Match("7AM ET", body)
	check(err)

	if match {
		reg := regexp.MustCompile("https://www.npr.org/rss/podcast.php\\?id=500005")
		body = reg.ReplaceAll(body, []byte("https://7news.randomthings.io"))
		err = ioutil.WriteFile(config.CacheFile, body, 0644)
		check(err)
	}
}

func GetEst() (hour time.Time) {
	t := time.Now()
	est, err := time.LoadLocation("America/New_York")
	check(err)
	return t.In(est)
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

type ServerConfig struct {
	NewsUrl   string
	CacheFile string
	Interval  int
}

func (c *ServerConfig) UnmarshalYAML(unmarshal func(interface{}) error) error {
	var aux struct {
		NewsUrl   string `yaml:"newsUrl"`
		CacheFile string `yaml:"cacheFile"`
		Interval  int    `yaml:"interval"`
	}

	if err := unmarshal(&aux); err != nil {
		return err
	}
	if aux.NewsUrl == "" {
		return errors.New("config: invalid `NewsUrl`")
	}
	if aux.CacheFile == "" {
		aux.CacheFile = "cache.json"
	}
	if aux.Interval == 0 {
		aux.Interval = 300000
	}

	c.NewsUrl = aux.NewsUrl
	c.CacheFile = aux.CacheFile
	c.Interval = aux.Interval
	return nil
}

func ReadConfig(file string) (*ServerConfig, error) {
	configFile := path.Join(file)

	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		return nil, err
	}

	var config ServerConfig
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
