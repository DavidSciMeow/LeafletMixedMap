// 引用前必须先执行Leaflet.js
// for source this page must add Leaflet.js, Leaflet.css and other plugins.

var map, markers, mapDiv;
var baseMaps = { //底图模式
    "A1": L.tileLayer('https://wprd04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', {
        maxZoom: 19,
        name: '高德路网',
        isCNMap: true,
        attribution: '&copy; 高德路网底图 (amap.com)'
    }),
    "A2": L.tileLayer('https://wprd04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6', {
        maxZoom: 19,
        name: '高德卫星',
        isCNMap: true,
        attribution: '&copy; 高德卫星底图 (amap.com)'
    }),
    "G1": L.tileLayer('https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 17,
        name: '智图街道',
        isCNMap: true,
        attribution: '&copy; 智图城市街道图 (geoq.cn)'
    }),
    "A1E": L.tileLayer('https://wprd04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=en&size=1&scl=1&style=7', {
        maxZoom: 19,
        name: 'AMap EN',
        isCNMap: true,
        attribution: '&copy; Amap Road Map English (amap.com)'
    }),
    "O1": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        name: 'OSM Global',
        isCNMap: false,
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }),
    "AG1": L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png', {
        maxZoom: 13,
        name: 'ArcGIS',
        isCNMap: false,
        attribution: '&copy; ArcGIS (arcgis.com)'
    }),
};

/**
 * 生成一个Marker
 * 
 * Create a Marker
 * @param {*} lat
 * 纬度 [latitude]
 * @param {*} lng 
 * 经度 [longitude]
 * @return {L.marker} 
 * 一个Marker对象 [an object of Marker]
 */
function CreateMarker(lat, lng) {
    //transform.js
    if (map.currentBaseMap.options.isCNMap) {
        var marker = L.marker(eviltransform.wgs2gcj(lat, lng));
        markers.addLayer(marker);
        return marker;
    } else {
        var marker = L.marker([lat, lng]);
        markers.addLayer(marker);
        return marker;
    }
}

/**
 *
 *
 * @param {number} [lat=39.9042]
 * @param {number} [lng=116.4074]
 * @param {number} [zoom=10]
 * @param {string} [_cursor="pointer"]
 */
function initMap(lat = 35.8617, lng = 104.1954, zoom = 5, _cursor = "pointer") {
    document.addEventListener('DOMContentLoaded', function () {
        //lat = 39.9042, lng = 116.4074, zoom = 10, _cursor = "pointer"
        mapDiv = document.createElement('div');
        mapDiv.style.height = '100%';
        mapDiv.style.width = '100%';
        document.body.appendChild(mapDiv);
        //生成地图元素
        map = L.map(mapDiv).setView([lat, lng], zoom);
        // 设置当前底图图层
        map.currentBaseMap = baseMaps["A1"];
        map.currentBaseMap.addTo(map);
        map.getContainer().style.cursor = _cursor;
    });
}

/**
 * 全屏幕适配地图
 * 
 * Full Screen map when window resize. (revalidate the map size)
 */
function enableFullScreen() {
    window.addEventListener('resize', function () { map.invalidateSize(); });
}

/**
 * 使用聚合标签
 * 
 * enable the Cluster marker.
 * @example 
 * `你可以通过更改这个行内的模板字符串来自定义聚合标签的样式`
 * `you can change the template string to customize the style of cluster marker.`
 * @param {string} [classnameString='marker-cluster']
 * 内联样式类名 (默认 `marker-cluster`, 可以自定义)
 * 
 * default class name is `marker-cluster` (you can customize it)
 */
function enableCluster(classnameString = 'marker-cluster') {
    document.addEventListener('DOMContentLoaded', function () {
        //生成聚合标签
        markers = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                var childCount = cluster.getChildCount();
                return L.divIcon({
                    html: `<div class="cluster-icon"><h1>${childCount}</h1></div>`,
                    className: classnameString,
                    iconSize: L.point(40, 40)
                });
            }
        });
        map.addLayer(markers);
    });
}

/**
 * 使用地图比例尺
 * 
 * enable the scaler of map.
 * @param {string} [positionString='bottomleft'] 
 * 放置位置 (默认左下角 `bottomleft`, 可选项 `topleft`, `topright`, `bottomright`)
 * 
 * default position is `bottomleft` (others like `topleft`, `topright`, `bottomright`)
 */
function enableScaler(positionString = 'bottomleft') {
    document.addEventListener('DOMContentLoaded', function () {
        L.control.scale({ position: positionString }).addTo(map);
    });
}

/**
 * 启动地图底图选择器
 * 
 * enable the selector of Map.
 * @param {string} [positionString='topleft'] 
 * 放置位置 (默认左下角 `bottomleft`, 可选项 `topleft`, `topright`, `bottomright`)
 * 
 * default position is `bottomleft` (others like `topleft`, `topright`, `bottomright`)
 */
function enableBaseMapSelector(positionString = 'topleft') {
    document.addEventListener('DOMContentLoaded', function () {
        var maprendercontrol = L.control({ position: positionString });
        maprendercontrol.onAdd = function () {
            var div = L.DomUtil.create('div', 'map-render-control');
            div.innerHTML;
            var select = document.createElement('select');
            select.id = 'baseMapSelector';
            for (var key in baseMaps) { select.appendChild(new Option(baseMaps[key].options.name, key, false, false)); }
            select.selectedIndex = 0;
            div.appendChild(select);
            L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
            return div;
        };
        maprendercontrol.addTo(map);
        document.getElementById('baseMapSelector').addEventListener('change', function () {
            var selectedBaseMap = baseMaps[baseMapSelector.value];
            isCNMap = (baseMapSelector.value != 'O1');
            if (map.currentBaseMap) { map.removeLayer(map.currentBaseMap); }
            map.addLayer(selectedBaseMap);
            map.currentBaseMap = selectedBaseMap;
        });
    });
}

/**
 * 转换EXIF到经纬度(十进制)
 *
 * Convert EXIF to Latitude and Longitude (Decimal)
 * @param {*} degrees
 * @param {*} minutes
 * @param {*} seconds
 * @param {*} direction
 * @return {*} 
 */
function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}
