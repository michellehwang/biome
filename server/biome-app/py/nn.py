from classifier import Classifier
from sklearn import neighbors
import numpy as np

from sklearn.externals import joblib

class NN(Classifier):
    def __init__(self, n, files=None):
        self.model = None
        self._trained = False
        self.n = n
        self.files = files

    def train(self, data):
        self.model = neighbors.KNeighborsClassifier(self.n)
        self.model.fit(data.x, data.y)
        self._trained = True

    def predict(self, vector):
        prediction = self.model.predict(vector)[0]
        return prediction, self.files[prediction][0]

def save(nn, name):
    joblib.dump(nn, 'model/' + name)

def load(name):
    return joblib.load('model/' + name)
