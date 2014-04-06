from classifier import Classifier
from sklearn import svm
import numpy as np

from sklearn.externals import joblib

class SVM(Classifier):
    def __init__(self, files=None):
        self.model = None
        self._trained = False
        self.files = files

    def train(self, data):
        self.model = svm.SVC(kernel='rbf')
        self.model.fit(data.x, data.y)
        self._trained = True

    def predict(self, vector):
        prediction = self.model.predict(vector)[0]
        return prediction, self.files[prediction][0]

def save(svm, name):
    joblib.dump(svm, 'model/' + name)

def load(name):
    return joblib.load('model/' + name)
