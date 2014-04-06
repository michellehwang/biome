from classifier import Classifier
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import sys

from sklearn.externals import joblib

class RF(Classifier):
    def __init__(self, n, files=None):
        self.model = None
        self._trained = False
        self.n = n
        self.files = files

    def train(self, data):
        self.model = RandomForestClassifier(self.n)
        self.model.fit(data.x, data.y)
        self._trained = True

    def predict(self, vector):
        prediction = self.model.predict(vector)[0]
        posteriors = self.model.predict_proba(vector)
        return prediction, self.files[prediction][0], posteriors[0]

def save(rf, name):
    joblib.dump(rf, 'model/' + name)

def load(name):
    return joblib.load('model/' + name)
