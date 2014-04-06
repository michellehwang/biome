from argparse import ArgumentParser
from data import Dataset
from iris import feature

from svm import SVM, save
from nn import NN
from rf import RF
from features import Collection, FeatureExtractor

import numpy as np

parser = ArgumentParser()
parser.add_argument('path')

classes = {
    'sharad' : 0,
    'michelle' : 1
}
if __name__ == "__main__":
    args = parser.parse_args()
    path = args.path
    d = Dataset(path, '.png')
    X = np.array([])
    y = np.array([])
    files = {}
    for img_path in d.images:
        f = img_path.split('/')[-1]
        name = f.split('-')[0]
        c = classes[name]
        vector = feature(img_path, FeatureExtractor(set(['daisy', 'hog', 'raw'])))
        if X.shape[0] == 0:
            X = vector
        else:
            X = np.vstack([X, vector])

        if y.shape[0] == 0:
            y = np.array([c])
        else:
            y = np.vstack([y, c])
        if c not in files:
            files[c] = []
        files[c].append(img_path)
    X = np.matrix(X)
    y = np.matrix(y)
    data = Collection(X, y)

    classifier = RF(100, files)
    classifier.train(data)
    save(classifier, 'rf')

    #classifier.train(data)
    #classifier.save('svm')
