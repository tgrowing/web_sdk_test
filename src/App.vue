<template>
  <div class="app">
    <h2>TGP Web SDK 测试-V2.1.1</h2>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="A" >页面A</el-menu-item>
      <el-menu-item index="B">页面B</el-menu-item>
    </el-menu>
    <router-view></router-view>
    <el-collapse v-model="activeName">
      <el-collapse-item title="获取本地存储数据" name="7">
        <div>获取本地存储数据：{{ storageData }}</div>
      </el-collapse-item>
      <el-collapse-item title="项目环境" name="1">
        <div>userAgent: {{ ua }}</div>
        <div>内嵌于小程序: {{ env.isMiniProgram }}</div>
        <div>内嵌于Android App环境: {{ env.isApp && env.isAndroid }}</div>
        <div>内嵌于IOS APP环境: {{  env.isApp && env.isIOS }}</div>
      </el-collapse-item>
      <el-collapse-item title="上报策略" name="2">
        <div>{{ strategy }}</div>
      </el-collapse-item>
      <el-collapse-item title="上报队列" name="3">
        <div class="report-info" id="suc"></div>
        <div class="report-info fail" id="fail"></div>
      </el-collapse-item>
      <el-collapse-item title="SDK初始化" name="4">
        <div class="new-sdk">
          <div>
            <span>appKey： </span>
            <el-input v-model="appKey" size="small" clearable type="text" class="sdk-input"/>
          </div>
          <div>
            <span>上报URL（选填，默认为SAAS线上地址）： </span>
            <el-input v-model="reportUrl" size="small" clearable type="text" class="sdk-input"/>
          </div>
          <div>
            <span>IOS AppKey（选填)：</span>
            <el-input v-model="iosAppKey" size="mini" clearable type="text" name="ios-app-key" id="ios-app-key" />
          </div>
          <div>
            <span>Android AppKey（选填)：</span>
            <el-input v-model="androidAppKey" size="mini" clearable type="text" name="android-app-key" id="android-app-key" />
          </div>
          <div>
            <span>小程序 AppKey（选填)：</span>
            <el-input v-model="weappAppKey" size="mini" clearable type="text" name="weapp-app-key" id="weapp-app-key" />
          </div>
          <div>
            <span>open id（选填)：</span>
            <el-input v-model="openId" size="mini" clearable type="text" name="id" id="open-id" />
          </div>
          <div>
            <span>delay（普通事件延迟上报时间, 选填, 单位ms, 默认5s)：</span>
            <el-input v-model="delay" size="mini" clearable type="text" name="delay" id="delay" />
          </div>
          <div>
            <span>sessionDuration（session变更的时间间隔, 选填, 单位ms, 默认5分钟)：</span>
            <el-input v-model="sessionDuration" size="mini" clearable type="text" name="session-duration" id="session-duration" />
          </div>
          <div>
            <span>maxDBCount（事件最大存储条数，选填, 单位个, 默认10000)：</span>
            <el-input v-model="maxDBCount" size="mini" clearable type="text" name="max-db-count" id="max-db-count" />
          </div>
          <div>
            设置公共参数（选填)：
            <div>
              <span>key: </span>
              <el-input class="common-input" size="mini" v-model="commonParams.key" clearable type="text"/>
              <span>value: </span>
              <el-input class="common-input" size="mini" v-model="commonParams.value" clearable type="text"/>
            </div>
          </div>
          <div>
            <el-button @click="setSdk" size="small" :disabled="inited">SDK初始化</el-button>
          </div>
        </div>
      </el-collapse-item>
       <el-collapse-item title="手动上报事件" name="5">
        <div class="event-code">
          <span style="{display: inilne-block; marginRight: 10px;}">事件code:</span>
          <el-input v-model="eventCode" size="mini" clearable type="text" name="code" id="event-code" />
        </div>
        <div v-for="(p, index) in params" :key="index" class="params">
          <h5>自定义参数{{ index + 1 }}：</h5>
          <div class="list-item">
            <span class="list-item-label">Key： </span>
            <el-input class="list-item-input" v-model="p.key" size="mini" clearable type="text" name="pk" :id="`params-key-${index}`" />
          </div>
          <div class="list-item">
            <span class="list-item-label">Value： </span>
            <el-input class="list-item-input" v-model="p.value" size="mini" clearable type="text" name="pv" :id="`params-value-${index}`" />
            <span style="{curson: pointer;}" @click="deleteParams(p)"><el-icon class="el-icon-delete"></el-icon></span>
          </div>
        </div>
        <div>
          <el-button @click="addParams" size="mini" type="text">
            新增参数
            <el-icon class="el-icon-plus" @click="deleteParams(p)"></el-icon>
          </el-button>
        </div>
        <el-button @click="handleManualReport" size="small" :disabled="!inited">普通上报</el-button>
        <el-button @click="handleRealTimeReport" size="small" :disabled="!inited">实时上报</el-button>
        <el-button @click="handleManualReportBatch" size="small" :disabled="!inited">普通上报（上报10000条）</el-button>
      </el-collapse-item>
        <el-collapse-item title="停止事件上报" name="8">
        <el-button @click="stopReport(false)" size="small" :disabled="stoped">停止事件上报(已进入上报队列的事件仍会完成上报)</el-button>
        <el-button @click="stopReport(true)" size="small" :disabled="stoped">立即停止事件上报</el-button>
      </el-collapse-item>
      <el-collapse-item title="恢复事件上报" name="9">
        <el-button @click="resumeReport" size="small" :disabled="!stoped">恢复事件上报</el-button>
      </el-collapse-item>
      <el-collapse-item title="更新open id" name="8">
        <el-input v-model="openId" size="mini" clearable type="text" name="id" id="u-open-id" />
        <el-button @click="setOpenId" size="small">设置OpenId</el-button>
      </el-collapse-item>
      <el-collapse-item title="上报h5_pv事件" name="9">
        <el-button @click="reportPV" size="small">上报h5_pv事件</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>

const DEFAULT_PARAM_OBJ = {
  key: '',
  value: '',
};
export default {
  data() {
    return {
      // 初始化传参
      appKey: 'appkey',
      iosAppKey: '',
      androidAppKey: '',
      weappAppKey: '',
      reportUrl: '',
      openId: '',
      delay: null,
      sessionDuration: 5 * 60 * 1000,
      maxDBCount: null,
      eventCode: '',
      params: [{ ...DEFAULT_PARAM_OBJ }],
      commonParams: {},
      beacon: {},
      ua: '',
      env: {},
      strategy: '',
      activeName: ['4', '5'],
      events: [],
      inited: false,
      stoped: false,
      activeIndex: 'A',
      jsBridge: true,
      storageData: null,
    };
  },
  created() {
    this.getEnv();
  },
  methods: {
    setSdk() {
      this.beacon = new window.BeaconAction({
        appkey: this.appKey, // 必填
        reportUrl: this.reportUrl, // 必填
        openid: this.openId,
        delay: Number(this.delay) || 0,
        sessionDuration: Number(this.sessionDuration) || 0,
        maxDBCount: Number(this.maxDBCount) || 0,
        jsBridge: true,
        weappAppkey: this.weappAppKey,
        channelID: 'web-sdk-new',
        onReportSuccess: (e) => {
          console.log('onReportSuccess : ' + e);
        },
        onReportFail: (e) => {
          console.log('onReportFail : ' + e);
        },
      });
      this.inited = true;
      localStorage.setItem('beacon_store', 'test');
      this.storageData = localStorage.getItem('beacon_store');
      this.setCommonParams();
    },
    getEnv()  {
      const ua = navigator.userAgent;
      this.ua = ua;
      /** 小程序内嵌h5 */
      // 微信7.0.0以上可用ua判断，window.__wxjs_environment
      const isMiniProgram = !!ua.match(/miniprogram/i) || window.__wxjs_environment === 'miniprogram';
      const isApp = !!ua.match(/isApp/i) || !!ua.match(/szient/i);
      /** android内嵌h5 */
      const isAndroid = !!ua.match(/Android|Adr/i);
      /** ios内嵌h5 */
      const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      this.env = {
        isMiniProgram,
        isApp,
        isAndroid,
        isIOS,
      }
      if (this.jsBridge) {
        if (isMiniProgram) {
          this.strategy = '检测到h5页面处于小程序环境，事件上报策略为上报一条事件，指向小程序';
        } else if (isApp && isAndroid) {
          this.strategy = '检测到h5页面处于Android app环境，事件上报策略为上报一条事件，指向Android APP';
        } else if (isApp && isIOS) {
          this.strategy = '检测到h5页面处于IOS app环境，事件上报策略为上报一条事件，指向IOS APP';
        } else {
          this.strategy = '检测到h5页面处于浏览器环境，事件上报策略为上报一条事件，指向h5';
        }
      } else {
        this.strategy = '多端通信关闭，事件上报策略为上报一条事件，指向h5';
      }
    },
    setOpenId() {
      this.beacon && this.beacon.setOpenId(this.openId);
    },
    handleManualReport() {
      const paramRes = this.params.reduce((acc, v) => {
        acc[v.key] = v.value;
        return acc;
      }, {});
      this.beacon && this.beacon.onUserAction(this.eventCode, paramRes);
    },
    handleManualReportBatch(i = 0) {
      i = Number(i)|| 0;
      if (this.beacon) {
        const count = 500;
        if (i >= count) return;
        setTimeout(() => {
          this.handleManualReport();
          i = i + 1;
          this.handleManualReportBatch(i);
        }, 50);
      }
    },
    handleRealTimeReport() {
      const paramRes = this.params.reduce((acc, v) => {
        acc[v.key] = v.value;
        return acc;
      }, {});
      this.beacon && this.beacon.onDirectUserAction(this.eventCode, paramRes);
    },
    setCommonParams() {
      if (this.commonParams.key && this.commonParams.value) {
        const param = {};
        param[this.commonParams.key] = this.commonParams.value;
        this.beacon && this.beacon.addAdditionalParams(param);
      }
    },
    addParams() {
      this.params.push({ ...DEFAULT_PARAM_OBJ });
    },
    deleteParams(item) {
      var index = this.params.indexOf(item);
      if (index !== -1) {
        this.params.splice(index, 1)
      }
    },
    handleSelect(key) {
      this.$router.push({ name: key})
    },
    reportPV() {
      this.beacon && this.beacon.reportPV();
    },
    stopReport(sign) {
      this.beacon && this.beacon.stopReport(sign);
      this.stoped = true;
    },
    resumeReport() {
      this.beacon && this.beacon.resumeReport();
      this.stoped = false;
    }
  },
};
</script>

<style scoped>
.app {
  padding: 35px;
}
.nav {
  margin-bottom: 20px;
}
.router-link-active {
  color: red;
}
a {
  margin-right: 10px;
  color:cornflowerblue;
}
.new-sdk div {
  padding: 5px 0;
}
.el-input {
  width: 150px;
  margin-right: 10px;
}
.sdk-input {
  width: 400px;
}
.params {
  padding: 0 10px;
}
.el-button {
  margin: 10px 0;
}
.router-link-active {
  color: red;
}
a {
  margin-right: 10px;
  color:cornflowerblue;
}
.new-sdk div {
  padding: 5px 0;
}
.common-input {
  width: 28%;
  max-width: 150px;
  margin-right: 10px;
}
.sdk-input {
  width: 70%;
  max-width: 400px;
}
.event-code .el-input {
  width: 70%;
  max-width: 200px;
}
.params {
  padding: 0 10px;
}
.el-button {
  margin: 0 10px 10px;
}
.list-item {
  margin-bottom: 5px;
}
.list-item-label {
  width: 50px;
  display: inline-block;
}
.list-item-input {
  max-width: 150px;
  margin-right: 10px;
}
.report-info {
  padding: 0 5px;
}
.report-info div {
  margin-bottom: 5px;
}
.fail div {
  color: red;
}
.nav a {
  margin-right: 10px;
}
</style>

