from argparse import ArgumentParser
from data import Dataset
from iris import feature

from svm import SVM, save
from features import Collection

import numpy as np

parser = ArgumentParser()
parser.add_argument('path')

if __name__ == "__main__":
    args = parser.parse_args()
    path = args.path
    d = Dataset(path, '.png')
    X = np.array([])
    y = np.array([])
    count = 0

    files = {}
    for img_path in d.images:
        vector = feature(img_path)
        if X.shape[0] == 0:
            X = vector
        else:
            X = np.vstack([X, vector])

        if y.shape[0] == 0:
            y = np.array([count])
        else:
            y = np.vstack([y, count])
        if count not in files:
            files[count] = []
        files[count].append(img_path)
        count += 1
    X = np.matrix(X)
    y = np.matrix(y)
    data = Collection(X, y)

    classifier = SVM(files)
    classifier.train(data)
    save(classifier, 'svm')

    #classifier.train(data)
    #classifier.save('svm')
