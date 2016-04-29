#!/bin/env python
import os
import json
import sys
import glob
import path

import errno

config_json=open("config.json").read()
config=json.loads(config_json)

