### TGP 小程序 SDK（政务）使用说明

#### 初始化

与默认TGP Web SDK不同，TGP 小程序 SDK（政务）需要在初始化时**额外**传入自定义上报服务url作为参数，否则上报对象将无法初始化：

```js
new BeaconAction({
  appkey: "myAppKey",
  reportUrl: "http://my.log.server", // NOTICE: 此项必填
  ...
});
```

