import sys

from argparse import ArgumentParser
from iris import feature
from skimage.util import img_as_ubyte
from skimage.data import imread
from svm import SVM, load

from features import FeatureExtractor

parser = ArgumentParser()

parser.add_argument('path')

if __name__ == "__main__":
    args = parser.parse_args()
    vector = feature(args.path, FeatureExtractor(set(['daisy', 'hog', 'raw'])))
    classifier = load('rf')
    prediction = classifier.predict(vector)
    print >>sys.stderr, prediction
    if abs(prediction[2][0]  - prediction[2][1]) <= 0.05:
        print >>sys.stderr, "Doubt"
        exit(-1)
    print prediction[1].split('/')[-1]
