/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
import React, { useEffect, useState } from 'react';
import TreasureAR from './TreasureAR';
import { Modal } from 'antd';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import TreasureGuide from './TreasureGuide';

const Map = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  @media ${props => props.theme.mobile} {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;

const MapWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  .center {
    position: absolute;
    font-size: 22px;
    right: 10px;
    top: 10px;
    background-color: red;
    z-index: 10;
  }

  .question {
    position: absolute;
    font-size: 22px;
    top: 10px;
    right: 60px;
    z-index: 10;
    background-color: blue;
  }
`;

const location = [
  {
    locate: 35.1403032,
    lonate: 129.1090968,
  },
  {
    locate: 35.1404132,
    lonate: 129.1092068,
  },
  {
    locate: 35.1405132,
    lonate: 129.1094068,
  },
  {
    locate: 35.1407132,
    lonate: 129.1097068,
  },
  {
    locate: 35.1404132,
    lonate: 129.1102068,
  },
  {
    locate: 35.1409132,
    lonate: 129.1092068,
  },
  {
    locate: 35.1410132,
    lonate: 129.1102068,
  },
];

function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

export default function TreasureMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mylat, setMylat] = useState();
  const [mylon, setMylon] = useState();
  const [mymap, setMymap] = useState();
  const [modal, setModal] = useState(false);
  const [guide, setGuide] = useState(false);
  const [centerlat, setCenterlat] = useState();
  const [centerlon, setCenterlon] = useState();
  // ?????? ?????? ??????
  const [markerLat, setMarkerLat] = useState();
  const [markerLon, setMarkerLon] = useState();

  const [kakao, setKakao] = useState();

  // ????????? ??? ????????? ??????

  // ???????????? ????????????
  // ?????? ????????? ????????????, ?????? ?????? ??????
  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation??? ???????????? ?????? ????????? ???????????????
      navigator.geolocation.watchPosition(function (position) {
        const lat = position.coords.latitude; // ??????
        const lon = position.coords.longitude; // ??????
        setMylat(lat);
        setMylon(lon);
      });
    } else {
      // HTML5??? GeoLocation??? ????????? ??? ????????? ?????? ?????? ????????? ??????????????? ????????? ???????????????
      alert('??????????????? ????????? ??? ?????????!! ?????? ?????? ?????? ??? ?????????!');
    }
  });

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation??? ???????????? ?????? ????????? ???????????????
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // ??????
        const lon = position.coords.longitude; // ??????
        setCenterlat(lat);
        setCenterlon(lon);
      });
    } else {
      // HTML5??? GeoLocation??? ????????? ??? ????????? ?????? ?????? ????????? ??????????????? ????????? ???????????????
    }
  }, []);

  const ARmodal = value => {
    console.log(value, '?????????');
    setModal(true);
    setMarkerLat(value.LocLat);
    setMarkerLon(value.LocLot);
    console.log(markerLat, markerLon);
  };

  const handleCancel = e => {
    setModal(false);
  };

  const openGuide = () => {
    setGuide(true);
  };

  const guideCancel = e => {
    setGuide(false);
  };

  const noDistance = () => {
    alert('????????? 50?????? ????????? ????????????!');
  };

  useEffect(() => {
    const Tscript = document.createElement('script');
    Tscript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`;
    Tscript.addEventListener('load', () => setMapLoaded(true));
    document.head.appendChild(Tscript);
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;
    const Kakao = window.kakao;
    setKakao(Kakao);

    Kakao.maps.load(() => {
      console.log(centerlat, centerlon, '????????????');
      const container = document.getElementById('map');
      const options = {
        center: new Kakao.maps.LatLng(centerlat, centerlon),
        level: 2,
      };

      const map = new window.kakao.maps.Map(container, options);

      const imageSrc = '/assets/images/icon.png';
      const imageSize = new window.kakao.maps.Size(50, 50);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      // ??? ?????? ????????????
      if (navigator.geolocation) {
        // GeoLocation??? ???????????? ?????? ????????? ???????????????.
        const locPosition = new Kakao.maps.LatLng(mylat, mylon); // ????????? ????????? ????????? geolocation?????? ????????? ????????? ???????????????

        // ????????? ?????????????????? ???????????????
        displayMarker(locPosition);
      } else {
        // HTML5??? GeoLocation??? ????????? ??? ????????? ?????? ?????? ????????? ??????????????? ????????? ???????????????
        // const locPosition = new Kakao.maps.LatLng(33.450701, 126.570667);
        // displayMarker(locPosition);
      }
      // ??? ?????? ????????????
      function displayMarker(locPosition) {
        const imageSrc = '/assets/images/icon.png';
        const imageSize = new window.kakao.maps.Size(50, 50);
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
        );
        // ????????? ???????????????
        var marker = new window.kakao.maps.Marker({
          map,
          position: locPosition,
          image: markerImage,
        });

        // ?????????????????? ????????? ??????

        // ?????? ??????????????? ??????????????? ???????????????
        map.setCenter(locPosition);
      }

      function panTo() {
        // ????????? ?????? ?????? ????????? ???????????????

        var moveLatLon = new Kakao.maps.LatLng(mylat, mylon);
        // ?????? ????????? ???????????? ??????????????????
        // ?????? ????????? ????????? ?????? ???????????? ?????? ???????????? ?????? ?????? ???????????????
        setCenterlat(mylat);
        setCenterlon(mylon);
        map.panTo(moveLatLon);
      }

      const center = document.querySelector('.center');
      center.addEventListener('click', () => panTo());
      // marker.setMap(map);
      // -- ????????? ?????? ????????? ?????? ?????? ????????????

      const locationMarkerImg =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

      const imgSize = new Kakao.maps.Size(50, 50);

      for (let i = 0; i < location.length; i++) {
        // ????????? ????????? ??????
        const imgSize = new window.kakao.maps.Size(24, 35);
        const LocationMarkerImg = new Kakao.maps.MarkerImage(
          locationMarkerImg,
          imgSize,
        );

        const LocLat = location[i].locate;
        const LocLot = location[i].lonate;
        const position = new Kakao.maps.LatLng(LocLat, LocLot);

        const LocMarker = new Kakao.maps.Marker({
          map,
          position,
          image: LocationMarkerImg,
          clickable: true,
        });

        LocMarker.setMap(map);
        console.log(mylat, mylon, '?????????');
        const dis = getDistanceFromLatLonInKm(mylat, mylon, LocLat, LocLot);
        const meter = dis * 1000;
        console.log(LocLat, LocLot, meter);
        // console.log(
        //   '????????? ??? ??????????????? ????????? : ',
        //   meter,
        //   '??????',
        //   mylat,
        //   mylon,
        // );
        if (meter <= 50) {
          // ?????? ??? ????????? ??????????????? ????????? 50?????? ????????????
          // ???????????? ????????????
          console.log('50??????');
          Kakao.maps.event.addListener(LocMarker, 'click', e =>
            ARmodal({ LocLat, LocLot }),
          );
        } else {
          console.log('50?????? ???');
          // 50?????? ?????????????
          Kakao.maps.event.addListener(LocMarker, 'click', e => noDistance());
        }
      }
    });
  }, [mapLoaded, centerlat, centerlon]);

  return (
    <MapWrapper>
      <div className="center">??????</div>
      <div
        className="question"
        onClick={() => {
          openGuide();
        }}
      >
        ???
      </div>
      <Map id="map" />

      {modal ? (
        <TreasureAR
          lat={markerLat}
          lot={markerLon}
          cancel={() => {
            handleCancel();
          }}
          modal={modal}
        />
      ) : null}

      <Modal
        title="???????????? ?????????"
        visible={guide}
        footer={null}
        onCancel={e => guideCancel(e)}
      >
        <TreasureGuide />
      </Modal>
    </MapWrapper>
  );
}
