import React, { useEffect, useRef, useState } from 'react';
import Marzipano from 'marzipano';
import './App.css';

function App() {
  const panoRef = useRef(null)
  const [viewer, setViewer] = useState();
  const [source, setSource] = useState();
  const [geometry, setGeometry] = useState();
  const [view, setView] = useState();
  const [scene, setScene] = useState();

  // The tiles were generated with the krpano tools, which index the tiles
  // from 1 instead of 0. Hence, we cannot use ImageUrlSource.fromString()
  // and must write a custom function to convert tiles into URLs.
  var urlPrefix = "//www.marzipano.net/media/lisboa";
  var tileUrl = function (z, x, y) {
    return urlPrefix + "/l" + z + "/" + y + "/l" + z + '_' + y + '_' + x + ".jpg";
  };

  // Create view.
  // The letterbox view limiter allows the view to zoom out until the image is
  // fully visible, adding black bands around the image where necessary.
  var limiter = Marzipano.util.compose(
    Marzipano.FlatView.limit.resolution(48384),
    Marzipano.FlatView.limit.letterbox()
  );


  useEffect(() => {
    setViewer(new Marzipano.Viewer(panoRef.current));
    setSource(new Marzipano.ImageUrlSource(function (tile) {
      return { url: tileUrl(tile.z + 1, tile.x + 1, tile.y + 1) };
    }));
    setGeometry(new Marzipano.FlatGeometry([
      { width: 756, height: 312, tileWidth: 756, tileHeight: 756 },
      { width: 1512, height: 624, tileWidth: 756, tileHeight: 756 },
      { width: 3024, height: 1248, tileWidth: 756, tileHeight: 756 },
      { width: 6048, height: 2496, tileWidth: 756, tileHeight: 756 },
      { width: 12096, height: 4992, tileWidth: 756, tileHeight: 756 },
      { width: 24192, height: 9984, tileWidth: 756, tileHeight: 756 },
      { width: 48384, height: 19968, tileWidth: 756, tileHeight: 756 }
    ]));
    setView(new Marzipano.FlatView({ mediaAspectRatio: 48384 / 19968 }, limiter));
  }, [])

  useEffect(() => {
    if (!!source && !!geometry && !!view) {
      setScene(viewer.createScene({
        source,
        geometry,
        view,
        pinFirstLevel: true
      }));
    }
  }, [viewer, geometry, source, view])

  useEffect(() => {
    if (!!scene) {
      scene.switchTo();
    }
  }, [scene])

  return (
    <div className="App">
      <div ref={panoRef}>
      </div>
    </div>
  );
}

export default App;
