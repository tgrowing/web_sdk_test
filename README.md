# 基础知识
##### 1. 事件模型（Event Model）
事件模型（Event Model）是以事件为基本研究对象，用来定义和描述一个用户在某个时间通过某种方式完成某个行为。事件的划分和定义，可以反映上报日志的名称和内在数据结构，需要业务根据自身情况需求进行合理设置
在事件模型中，定义的事件包括以下类型的信息。
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/datainsight/test/images/step12.png)

What： 描述用户所做的这个事件的具体内容。在平台中，会通过日志里的 eventCode 来区分用户的不同行为，例如登录、播放、购买、页面访问等。

Who： 即触发这次事件的用户。在平台中，会通过日志里的UIN字段默认分配一个设备唯一ID来标识当前用户，即设备ID。当然，也可以通过自定义其他字段来上报其他类型UID，例如imei、mac、guid、QQ号、OpenID、业务账号UID等。

When： 即这个事件发生的实际时间。在平台中，使用 event_time 字段来记录精确到毫秒的触发时间。如果由于网络问题延迟上报，事件原始触发时间不会发生变化。但是这条日志进入的分区可能会延后到第二天，因此分区时间ds可能包含少量不在当天触发的事件。建议尽量使用 event_time 事件触发时间来进行分析，更加反应事件的客观情况。

以上的 What、Who、When 是一条事件的3个基本要素，在事件定义中缺一不可。

Params： 即用户从事这个事件的方式。这个概念比较广，包括用户所在的地理位置、使用的设备、使用的浏览器、使用的 App 版本、操作系统版本、进入的渠道、跳转过来时的 referer 、当前行为的类别等。这些参数字段能够详细记录用户触发事件的具体情况属性，以便于进行灵活精准地数据分析工作。

在 Params 扩展属性参数这部分中，如果使用平台SDK上报，平台会预置一些参数字段作为接口供业务上报。预置字段能够使数据上报更加规范、减少由于对名称理解不一所导致的误解，因此建议尽量使用预置的字段上报对应信息，如果没有相应的预置字段，可以通过定义自定义参数字段来扩展上报。
##### 2.定义事件的 event code 和显示名
（一）定义事件event code的核心问题是如何把握事件的颗粒度。
理论上可以随意定义事件名称，然后交由开发按特定规则进行拼接、解析、统计。但是平台定位于自动敏捷分析，中间无人工参与，因此为了确保最终业务的分析使用效率，请重视这个环节。这个环节重要但是不复杂。
如果颗粒度过粗，例如命名为“页面访问事件”“点击事件”“内容曝光事件”，那么分析用户行为时，非常宽泛且没有针对性，并且总是需要结合多个参数字段，去筛选出特定的某项操作；
如果颗粒度过细，例如“首页点击播放音乐”“列表页点击播放音乐”“歌单页点击播放音乐”，便显得重复累赘，数量过多不便维护。
（二）具体怎么把握事件的划分呢？
通常一个App产品的事件数量， 不多于500个，不少于10个为宜 。（按产品功能复杂度有所调整，这个数字只是个参考。除非你的App是个类似QQ浏览器、手机QQ等，集成了复杂业务形态的超级App；或者是个手电筒App交互足够简单的工具App）



# 接入说明

### 集成SDK

#### 手动引入

SDK包：BeaconAPI_Base.framework —基础上报SDK，必选 
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step1.png)

### 初始化SDK及上报

#### 引入头文件
```js
// index.html
<script src="tgp_h5_sdk.min.js"></script>
```

#### 初始化SDK

```js
const success = e => {    
   console.log('onReportSuccess : ' + e);    
};    
const fail = e => {    
   console.log('onReportFail : ' + e);    
};
const beacon = new BeaconAction({    
   appkey: 'appkey1', // 数据资源appkey, 必填    
   reportUrl: 'https://xxx', // 上报 URL, 必填    
   versionCode: '', //项目版本, 选填, 不设置会走默认配置   
   channelID: '', //渠道, 选填, 不设置会走默认配置 
   openid: '', // 用户 id, 选填, 不设置会走默认配置     
   delay: 1000, // 普通事件延迟上报时间(单位毫秒), 默认 3000(3 秒), 选填, 不设置会走默认配置 
   sessionDuration: 60 * 1000, // session 变更的时间间隔, 一个用户持续 30 分钟(默认值)没有 任何上报则算另一次 session, 每变更一次session上报一次启动事件(rqd_applaunched),使用毫秒 (ms), 最小值 30 秒, 选填, 不设置会走默认配置
   onReportSuccess: success, // 上报成功回调, 选填, 不设置会走默认配置 
   onReportFail: fail, // 上报失败回调, 选填, 不设置会走默认配置 
});
```
Appkey获取渠道之一：
- DataInsight官网地址 [https://growth.qq.com](https://growth.qq.com/)
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step2.png)


#### 至此，SDK已初始化完成，可以开始上报事件
平台 SDK 上报格式默认为 K-V 对形式。其中，Key 值有唯一含义，不需要通过其它解析标志其含义；Value 值有唯一含义，不需要通过其它解析标志其含义。
后端对接可支持 K-V 对形式及宽表结构数据。K-V 对格式要求如上，宽表结构数据要求每一列有明确的含义，不需要通过其它解析标志其含义
### SDK API

#### 普通事件上报接口

注意!!!! value 类型只能是 string 或者 number 类型, eventCode不允许与预置事件名相同

```js
beacon.onUserAction('eventCode', {
  'city': 'shenzhen'
});
```
#### 实时事件上报接口

注意!!!! value 类型只能是 string 或者 number 类型, eventCode不允许与预置事件名相同

```js
beacon.onDirectUserAction('eventCode', {
  'city': 'shenzhen'
});
```

#### 获取 设备id

```js
beacon.getDeviceId()
```
#### 设置公共参数

注意 !!!! , 相比老接口(setAdditionalParams)新接口是追加,老接口为替换

```js
beacon.addAdditionalParams({
  'additionalParams': 'params'
});
```

#### 手动上报 PV

```js
beacon.reportPV();
```
#### 设置 用户id

```js
beacon.setOpenId('openid');
```

### 事件上报

#### 上报事件登记

##### 进入到应用

![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step3.png)
##### 登记事件（创建登记事件或查看登记事件）

![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step4.png)

##### 对应事件上传代码展示

```js
// 上报实时事件
beacon.onDirectUserAction('testDemoButtonClick', {
  button_name: 'report_button1'
});

// 上报普通事件
beacon.onUserAction('testDemoButtonClick', {
  button_name: 'report_button1'
});
```

#### 判断事件的发送情况

#### 方法一

事件数据发送成功时，在浏览器开发者工具的 Network 模块中，可以看到upload?tp=js的网络请求，如果状态码为 200，则代码事件数据发送成功。

![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step5.png)


#### 方法二

借助初始化时设置的回调函数。回调函数用户可按自己需求定义，这里给到的是一种打印到浏览器控制台以查看事件发送情况的方案。

![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step6.png)

#### 上报事件查看

![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step13.png)

### 本地启动demo操作流程

1、在demo根目录下，执行命令：npm install，安装依赖包。

2、执行命令：npm run start，启动服务, 服务启动完成如下图展示。
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step8.png)

3、双击（打开）生成的服务地址，运行即可
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step9.png)

4、初始化参数填写示例
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step10.png)

5、事件上报填写示例
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step11.png)

6、事件上报日志展示
![image.png](https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/images/web-sdk-demo/step12.png)


### 扩展功能

#### APP 打通 H5

集成了 Web JS SDK 的 H5 页面，在嵌入到 App 后，H5 内的事件可以通过 App 进 行发送，事件发送前会添加上 App 采集到的预置属性。该功能默认是关闭状态，如果 需要开启，需要在 App 和 H5 端同时进行配置。这里给到的是 H5 端的配置，即初始 化传参时增加 jsBridge: true。APP 端配置请参考 APP SDK。 

```js
const beacon = new BeaconAction({    
  appkey: "qppkey1", // 系统或项目 id, 必填    
  reportUrl: 'https://xxx', // 上报 URL, 必填    
  jsBridge: true, // 为 ture, 用于标识开启 多端 打通 H5 的能力, 必填   
  //其他初始化参数可按需配置    
});
```

#### 微信小程序打通H5

 集成了 Web JS SDK 的 H5 页面，在嵌入到 微信小程序 后，H5 内的事件发送前会 添加上 从 微信小程序 采集到的预置属性，目前支持用户标识、用户 uid 及是否为新 用户。该功能默认是关闭状态，如果需要开启，需要在 微信小程序端 和 H5 端同时 进行配置。这里给到的是 H5 端的配置，即初始化传参时增加 jsBridge: true 和 weappAppkey。小程序端配置请参考小程序端 SDK。 
```js
const beacon = new BeaconAction({    
  appkey: "appkey1", // 系统或项目 id, 必填    
  reportUrl: 'https://xxx', // 上报 URL,必填    
  jsBridge: true, // 为 ture, 用于标识开启 多端 打通 H5 的能力， 必填
  weappAppkey: 'appkey2', // 小程序端 APPkey, jsBridge 为 true 时必填
  // 其他初始化参数可按需配置
});
```
