export default {
  defaultServer: 'http://192.168.10.4:8878',
  //defaultServer: 'http://47.92.128.157:8088',
  //defaultServer: 'http://192.168.1.242:8085',

  // 测试vpn地址，后续修改
  //vpnServer: '/xspi/mt2/session/login',
  pathServerValidation: '/xspi/mt2/session/index',

  pathImageService: '/dnaserver?serviceId=image&imageId=',
  pathAttachmentService: '/dnaserver?serviceId=bill-accessory&EnclosureId=',

  // 登陆
  pathLogin: '/xspi/mt2/session/login',
  pathLoginConfig: '/xspi/mt2/res/index/com.jiuqi.mt2.spi.resource.key',
  pathChangePwd: '/xspi/mt2/svc/portal/modify_pwd',
  // 基础资料
  pathBasedataDefine: '/xspi/mt2/svc/basedata/get_basedata_define',
  pathBasedataList: '/xspi/mt2/svc/basedata/list',
  pathBasedataSearch: '/xspi/mt2/svc/basedata/searchbaseta',

  pathGetUser: '/xspi/mt2/svc/portal/get_user',
  pathGetFunctions: '/xspi/mt2/svc/portal/get_functions',
  pathGetNetLink: '/xspi/mt2/svc/netlink/get_netlink',
  pathReimbList: '/xspi/mt2/session/index',

  pathRestGet: '/xspi/mt2/svc/rest/get',
  pathSaveBill: '/xspi/mt2/svc/bill/save_bill',
  pathDeleteBill: '/xspi/mt2/svc/bill/delete_bill',
  pathSubmitBill: '/xspi/mt2/svc/bill/commit_bill',
  pathSaveBillEnclosure: '/xspi/mt2/svc/bill/save_bill_enclosure',

  pathQueryGetDefine: '/xspi/mt2/svc/query/getDefine',
  pathQueryGetListData: '/xspi/mt2/svc/query/getListData',
  pathQueryGetSumValue: '/xspi/mt2/svc/query/getSumValue',

  // ios token上报
  pathDeviceToken: '/plugins/pnservice/iostoken',
  keyIosDeviceToken: 'keyIosDeviceToken',

  pubkey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
  FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
  xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
  gwQco1KRMDSmXSMkDwIDAQAB`,
  privatekey: `MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
  WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
  aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
  AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
  xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
  m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
  8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
  z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
  rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
  V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
  aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
  psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
  uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876`
};
