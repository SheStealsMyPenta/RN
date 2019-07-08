import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  WebView,
  Linking
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import template from 'lodash/template';
import Share from 'react-native-share';

import ReturnButton from '../../components/ReturnButton';
import { showError, showToast } from '../../utils/Helper';
import { logoImg, signatureCus, signatureEmp } from './img';

var dataTemplate = {
  logo: logoImg,
  logoNameCN: '中国民用航空飞行校验中心',
  logoNameEN: 'FLIGHT INSPECTION CENTER OF CAAC',
  titleCN: '飞行校验通知单',
  titleEN: 'THE FLIGHT INSPECTION FEE NOTE',
  customerName: '',
  airportName: '',
  flightModel: '',
  flightNo: '',
  dateStart: '',
  dateEnd: '',
  captain: '',
  inspectors: '',
  durationHour: 0,
  durationMinute: 0,
  feeRate: 0,
  extraDurationHour1: 0,
  extraDurationMinute1: 0,
  extraDurationFeeRate1: 0,
  extraDurationHour2: 0,
  extraDurationMinute2: 0,
  extraDurationFeeRate2: 0,
  paymentAmountCN: '',
  paymentAmount: 0,
  devices: [],
  cfiPaymenInfo: {
    companyName: '中国民航飞行校验中心',
    taxID: '12100000H52628952E',
    registerAddress: '北京市朝阳区首都机场货运北路18号',
    registerPhoneNum: '010-64543273',
    bankBranch: '工行北京首都机场支行',
    bankAccount: '0200006009004611267'
  },
  customerPaymentInfo: {
    companyName: '',
    taxID: '',
    registerAddress: '',
    registerPhoneNum: '',
    bankBranch: '',
    bankAccount: '',
    address: '',
    email: '',
    cellPhone: '',
    invoiceAddress: ''
  },
  signatureEmp: '',
  signatureCus: '',
  invoiceNum:'',
};

const htmlString = `
<html>
<head>
  <meta charset="utf-8">
  <meta name="format-detection" content="telephone=no"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=0.4,maximum-scale=1.0,user-scalable=yes"/>
  <style>
     *{
        padding: 0;
        margin: 0;
     }
      body{
         font-size: 12px;
         overflow-x: hidden;
         width: 210mm;
      }
      #payment{
         display:flex;
         justify-content:space-around;
      }
      table tbody tr:nth-of-type(2n){
         background: #ddd;
      }
      .p1{
         padding: 0 60px;
         text-align: left;
         overflow:hidden;
      }
      .p2{
        padding: 0 15px;
        text-decoration: underline;
      }
      .p1>span{
        float:left;width:50%;
      }
  </style>
</head>
<body>

<div id='header' style='text-align:center'>
<div style='float:left'>
  <img width='57' height='50' src="<%=data.logo%>" />
</div>
<div style='float:left'>
<div style="margin-top:7px;font-size:14px;"><%=data.logoNameCN%></div>
<div style="margin-top:5px;"> <%=data.logoNameEN %></div>
</div>
<div id='billNum' style='margin-top: 10;margin-right:10;padding:10;float:right;'>
  <h5> <%=data.invoiceNum %> </h5>
</div>

<br/><br/><br/><br/><br/><br/>
<div id='title'>
  <h1 style="margin-bottom:0;text-align:center;"> <%=data.titleCN %> </h1>
  <p style="margin-top:0;text-align:center;"> <%=data.titleEN %> </p>
</div>

<br/>
<div class="p p1"> 
  <span >所属单位：<U class="p2"><%=data.customerName%></U></span>
  <span >校飞地点：<U class="p2"><%=data.airportName%></U>
  机型机号：<U class="p2"><%=data.flightModel%>-<%=data.flightNo%></U></span>
</div>
<div class="p p1">
<span >校飞时间：<U class="p2"><%=data.dateStart%></U>至
               <U class="p2"><%=data.dateEnd%></U></span>
<span >机长：<U class="p2"><%=data.captain%></U>
校验员：<U class="p2"><%=data.inspectors%></U></span>
</div>
<div class="p p1">
<span >飞行时间：<U class="p2"><%=data.durationHour%></U>小时
         <U class="p2"><%=data.durationMinute%></U>分钟,</span>
<span >收费标准：
<span class="p2">
<% if(data.feeRate===1){ %>
 <input type='checkbox' id='cbox1' checked='true' onclick='return false'>
<% }else{ %>
 <input type='checkbox' id='cbox1'  onclick='return false'>
<% } %>
  <label for='cbox1'>I档</label>
</span>
<span class="p2">
<% if(data.feeRate===2){ %>
 <input type='checkbox' id='cbox2' checked='true' onclick='return false'>
<% }else{ %>
 <input type='checkbox' id='cbox2'  onclick='return false'>
<% } %>
  <label for='cbox2'>II档</label>
</span>
<span class="p2">
<% if(data.feeRate===3){ %>
 <input type='checkbox' id='cbox3' checked='true' onclick='return false'>
<% }else{ %>
 <input type='checkbox' id='cbox3'  onclick='return false'>
<% } %>
  <label for='cbox3'>III档</label>
</span></span>
</div>
<div class="p p1">
<span >另有（一）：
<U class="p2"><%=data.extraDurationHour1%></U>小时
<U class="p2"><%=data.extraDurationMinute1%></U>分钟,</span>
<span >按<U class="p2"><%=data.extraDurationFeeRate1%></U>%收费</span>
</div>
<div class="p p1">
<span >另有（二）：
<U class="p2"><%=data.extraDurationHour2%></U>小时
<U class="p2"><%=data.extraDurationMinute2%></U>分钟,</span>
<span >按<U class="p2"><%=data.extraDurationFeeRate2%></U>%收费</span>
</div>

<div class="p1" id='sum' style='margin-left:auto;margin-right:auto;text-align:left;'>
<p>付款金额人民币（大写）：<U class="p2"><%=data.paymentAmountCN%></U>，（小写）￥：<U class="p2"><%=data.paymentAmount%></U></p><br/>
</div>
<table border='0' cellspacing="0" style="font-size:12px;text-align:center;width:100%;margin-top:15px;">
  <thead style="color:#fff;">
     <tr bgcolor='#999999'>
       <td>设备序号</td>
       <td>设备类型</td>
     <td>数量</td>
     <!--
     <td>台址</td>
     <td>呼号</td>
     <td>校验类型</td>
     <td>是否加收</td>
     -->
     </tr>
  </thead>
 <tbody>
 <% for(var i=0;i<data.devices.length;i++) { %>
  <tr>
     <td> <%=i+1%> </td>
     <td> <%=data.devices[i].type%> </td>
     <td> <%=data.devices[i].sum%> </td>

     <td> <%=data.devices[i].radioAddr%> </td>
     <td> <%=data.devices[i].callCode%> </td>
     <td> <%=data.devices[i].inpectionType%> </td>
     <td>
      <% if(data.devices[i].isExtraFeeAdded){ %>
             是
      <% } %>
     </td>

  </tr>
 <% } %>
</tbody>
</table>
<div id='payment-header' style="overflow:hidden;margin-top:15px;">
<div id='payment-header-left' style='width:50%;float:left;background-color:#cccccc;'>
  <b>收款方开票信息</b></div>
<div id='payment-header-right' style='width:50%;float:left;background-color:#cccccc;'>
  <b>付款方开票信息</b></div>
</div>
<div id='payment'style='margin-left:auto;margin-right:auto;text-align:left;'>
  <div id='payment-left'>
    <p>
      <span>单位全称：</span>
      <span><%=data.cfiPaymenInfo.companyName%></span>
    </p>
    <p>
      <span>纳税识别号：</span>
      <span><%=data.cfiPaymenInfo.taxID%></span>
    </p>
    <p>
      <span>注册地址：</span>
      <span><%=data.cfiPaymenInfo.registerAddress%></span>
    </p>
    <p>
      <span>注册电话：</span>
      <span><%=data.cfiPaymenInfo.registerPhoneNum%></span>
    </p>
    <p>
      <span>开户银行：</span>
      <span><%=data.cfiPaymenInfo.bankBranch%></span>
    </p>
    <p>
      <span>银行账号：</span>
      <span><%=data.cfiPaymenInfo.bankAccount%></span>
    </p>
  </div>
  <div id='payment-right'>
    <p>
      <span>单位全称：</span>
      <span><%=data.customerPaymentInfo.companyName%></span>
    </p>
    <p>
      <span>纳税识别号：</span>
      <span><%=data.customerPaymentInfo.taxID%></span>
    </p>
    <p>
      <span>注册地址：</span>
      <span><%=data.customerPaymentInfo.registerAddress%></span>
    </p>
    <p>
      <span>注册电话：</span>
      <span><%=data.customerPaymentInfo.registerPhoneNum%></span>
    </p>
    <p>
      <span>开户银行：</span>
      <span><%=data.customerPaymentInfo.bankBranch%></span>
    </p>
    <p>
      <span>银行账号：</span>
      <span><%=data.customerPaymentInfo.bankAccount%></span>
    </p>
    <p>
      <span>通讯地址：</span>
      <span><%=data.customerPaymentInfo.address%></span>
    </p>
    <p>
      <span>EMAIL：</span>
      <span><%=data.customerPaymentInfo.email%></span>
    </p>
    <p>
      <span>手机号码：</span>
      <span><%=data.customerPaymentInfo.cellPhone%></span>
    </p>
    <p>
      <span>发票邮寄地址：</span>
      <span><%=data.customerPaymentInfo.invoiceAddress%></span>
    </p>
  </div>
</div>

<div id='signature' style='display:flex;justify-content:space-around;margin-left:auto;margin-right:auto;margin-top:40px;text-align:left;'>
  
    <p> 
      <span>校验员（签字）：</span>
      <img width='100' height='50' src="<%=data.signatureEmp%>" />
    </p>
  
  
    <p>
      <span>联系人（签字）：</span>
      <img width='100' height='50' src="<%=data.signatureCus%>" />
    </p>
   
</div>

<div id='appendix' style='margin-top: 50px; margin-left:50px; margin-right:auto; text-align:left;'>
说明：我中心在收到银行的校验费入账通知后，开具正式发票并邮寄给付款单位，中心财务电话：010-64543269
</div>
<script type="text/javascript">
var p = document.getElementsByClassName('p');
var w =getComputedStyle(p[0].children[1]).width;
for(var i = 0 ;i <p.length; i++){
   p[i].children[1].style.width = w;
}
</script>

</body>
</html>`;

class FormPreviewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
      isPdfCreated: false,
      pdfPath: ''
    };
  }

  async createPDF(htmlStr, fileName, directory) {
    //console.log(img);
    let options = {
      html: htmlStr,
      fileName: fileName, //'test'
      directory: directory //'docs'
    };

    try {
      let file = await RNHTMLtoPDF.convert(options);
      global.log(file.filePath);
      return file.filePath;
    } catch (error) {
      showToast(error);
    }
  }

  //加载外部传来的数据
  loadData = previewData => {
    //ToDo:
    //load detailed data of a filled form
    global.log(previewData);
    let formData = '';
    if (!previewData) return formData;
    formData = dataTemplate;
    formData.customerName = previewData.customerName;
    formData.airportName = previewData.airportName;
    formData.flightModel = previewData.flightModel;
    formData.flightNo = previewData.flightNo;
    formData.dateStart = previewData.dateStart;
    formData.dateEnd = previewData.dateEnd;
    formData.captain = previewData.captain;
    formData.inspectors = previewData.inspectors;
    formData.durationHour = previewData.durationHour;
    formData.durationMinute = previewData.durationMinute;
    switch (previewData.feeRate) {
      case '一档':
        formData.feeRate = 1;
        break;
      case '二档':
        formData.feeRate = 2;
        break;
      case '三档':
        formData.feeRate = 3;
        break;
    }
    //formData.feeRate=previewData.feeRate;
    formData.extraDurationHour1 = previewData.extraDurationHour1;
    formData.extraDurationMinute1 = previewData.extraDurationMinute1;
    formData.extraDurationFeeRate1 = previewData.extraDurationFeeRate1;
    formData.extraDurationHour2 = previewData.extraDurationHour2;
    formData.extraDurationMinute2 = previewData.extraDurationMinute2;
    formData.extraDurationFeeRate2 = previewData.extraDurationFeeRate2;
    formData.paymentAmountCN = previewData.paymentAmountCN;
    formData.paymentAmount = previewData.paymentAmount;
    formData.devices = previewData.devices;
    formData.customerPaymentInfo = previewData.customerPaymentInfo;
    formData.signatureCus = previewData.signatureCus;
    formData.signatureEmp = previewData.signatureEmp;
    formData.invoiceNum = previewData.invoiceNum;
    return formData;
  };

  componentWillMount() {
    const { navigation } = this.props;
    if (!navigation.state.params.previewData) {
      showToast('预览失败，请重试');
      return;
    }
    let data = this.loadData(navigation.state.params.previewData);
    global.log('预览数据', data);
    if (data && data !== null) {
      let compiled = template(htmlString)({ data: data });
      //更新state
      this.setState({
        html: compiled
      });
      //console.log(compiled);
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    //去掉文件名中的 "/ \ "等特殊字符

    if (!navigation.state.params.previewData) {
      return;
    }
    let fileName = navigation.state.params.previewData.docTitle.replace(
      /[/、]/g,
      '-'
    );
    navigation.setParams({
      createPDF: this.createPDF,
      html: this.state.html,
      fileName: fileName
    });
  }
  componentWillReceiveProps(nextProps) {
    //global.log('aaaaa',nextProps);
    const { navigation } = nextProps;
    //pdf文件生成后，直接分享
    if (navigation.state.params.pdfPath) {
      let shareOptions = {
        title: '复制PDF到U盘',
        message: 'copy pdf',
        url: navigation.state.params.pdfPath
      };
      Share.open(shareOptions);
    }
  } 

  render() {
    let src = { uri: this.state.pdfPath };
    //console.log(src);
    return (
      <View style={styles.container}>
        {this.state.html ? (
          <WebView
            style={{ flex: 1 }}
            source={{ html: this.state.html }}
            automaticallyAdjustContentInsets={true}
            scalesPageToFit={true}
          />
        ) : (
          <Text>暂无数据预览</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default FormPreviewer;
