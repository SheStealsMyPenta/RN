export const STEP_INITIAL = 0; // 初始状态，表单还未处理
export const STEP_SAVED = 1; // 已保存
export const STEP_USERS = 2; // 选择用户
export const STEP_AGREE_1 = 3; // 同意第一步
export const STEP_AGREE_2 = 4; // 同意第二步
export const STEP_DISAGREE_1 = 5; // 驳回第一步
export const STEP_DISAGREE_2 = 6; // 已驳回
export const STEP_SUBMITTED = 7; // 已提交
export const STEP_DELETED = 8; // 已删除

export const UPLOADER_UPLOADING = 0;
export const UPLOADER_ERROR = 1;
export const UPLOADER_SUCCESS = 2;

export const VPN_STATUS_QUERY_NOT_INIT = -1; //未初始化
export const VPN_STATUS_UNSTART = 0;//未启动
export const VPN_STATUS_INITING = 1;//正在初始化
export const VPN_STATUS_INIT_OK =2;//初始化完成
export const VPN_STATUS_LOGINING = 3;//正在进行认证
export const VPN_STATUS_RELOGIN = 4;//重新进行认证
export const VPN_STATUS_OK = 5;//认证成功，正常运行中
export const VPN_STATUS_EXITING = 6;//正在退出VPN的状态
export const VPN_STATUS_ERR_THREAD = 7;//非主线程错误
export const VPN_STATUS_LOGOUT = 8;//用户已经注销
export const VPN_STATUS_TIME_OUT = 9;//查询VPN状态超时或网络错误
export const VPN_STATUS_QUERY_ERR = 10;//VPN查询时出现错误
export const VPN_STATUS_CANCELING = 11;//正在取消认证流程
export const VPN_STATUS_ONLINE = 12;//在线状态
export const VPN_STATUS_OFFLINE = 13;//离线状态 