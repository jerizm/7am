package main

import (
	"errors"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"path"
)

type serverConfig struct {
	NewsUrl   string
	CacheFile string
	Interval  int
}

func (c *serverConfig) UnmarshalYAML(unmarshal func(interface{}) error) error {
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

func readConfig(file string) (*serverConfig, error) {
	configFile := path.Join(file)

	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		return nil, err
	}

	var config serverConfig
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
