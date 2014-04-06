from argparse import ArgumentParser
from iris import feature
from skimage.util import img_as_ubyte
from skimage.data import imread
from svm import SVM, load

parser = ArgumentParser()

parser.add_argument('path')

if __name__ == "__main__":
    args = parser.parse_args()
    vector = feature(args.path)
    classifier = load('svm')
    prediction = classifier.predict(vector)
    print prediction[1].split('/')[-1]
