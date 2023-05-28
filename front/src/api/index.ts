import ajax from "@/common/ajax";
import mock from "../mock/index";
import { MessageAPi, ResponseData, LoginApi, PowerApi, MenuInfoApi, UserListApi, ResponseUserInfo, VisitorApi, VisitorListApi, MenuResponse, MenuListResponse } from "@/types"

const request = import.meta.env.REACT_APP_MOCK === "1" ? mock : ajax;

const getMenu = () => request.get("/getmenu") as Promise<MenuResponse>;
const login = (data: any) => request.post("/login", data) as Promise<LoginApi>;
const addMenu = (data: any) => request.post("/addmenu", data) as Promise<ResponseData>;
const addMsg = (data: any) => request.post("/addmessage", data) as Promise<ResponseData>;
const getMsg = (data: any) => request.get("/getmessage", data) as Promise<MessageAPi>;
const getPower = () => request.get("/getpower") as Promise<PowerApi>;
const delMenu = (data: any) => request.post("/delmenu", data) as Promise<ResponseData>;
const getMenuInfo = (data: any) => request.get("/getmenuinfo", data) as Promise<MenuInfoApi>;
const editMenu = (data: any) => request.post("/editmenuinfo", data) as Promise<ResponseData>;
const getVisitorList = (data: any) => request.get("/getiplist", data) as Promise<VisitorListApi>;
const getVisitorData = () => request.get("/getvisitordata") as Promise<VisitorApi>;
const getUserList = (data: any) => request.get("/getuserlist", data) as Promise<UserListApi>;
const addUser = (data: any) => request.post("/adduserinfo", data) as Promise<ResponseData>;
const getUser = (data: any) => request.get("/getuserinfo", data) as Promise<ResponseData & { data: ResponseUserInfo }>;
const editUser = (data: any) => request.post("/edituserinfo", data) as Promise<ResponseData>;
const editType = (data: any) => request.post("/edittype", data) as Promise<ResponseData>;
const addType = (data: any) => request.post("/addtype", data) as Promise<ResponseData>;


const getClassificationList = () => request.get("/category") as Promise<any>;
const getClassificationDetail = (data: any) => request.get("/categoryInfo", data) as Promise<any>;
const addClassification = (data: any) => request.post("/category", data) as Promise<ResponseData>;
const editClassification = (data: any) => request.post("/editCategory", data) as Promise<ResponseData>;
const deleteClassification = (data: any) => request.get("/deleteCategory", data) as Promise<ResponseData>;
const uploadImage = (data: any) => request.post("/upload", data, {headers: { "content-type": "multipart/form-data" }}) as Promise<ResponseData>;
const addArticle = (data: any) => request.post("/article", data) as Promise<ResponseData>;
const editArticle = (data: any) => request.post("/editArticle", data) as Promise<ResponseData>;
const getArticleList = (data: any) => request.get("/articles", data) as Promise<UserListApi>;
const deleteArticle = (data: any) => request.get("/deleteArticle", data) as Promise<ResponseData>;
const getArticleDetail = (data: any) => request.get("/getArticleDetail", data) as Promise<ResponseData>;

export const getFeedBack = (data: any) => request.post("/getfeedback", data) as Promise<ResponseData>;
export const reply = (data: any) => request.post("/reply", data) as Promise<ResponseData>;
export {
  getMenu,
  login,
  addMenu,
  addMsg,
  getMsg,
  getPower,
  delMenu,
  getMenuInfo,
  editMenu,
  getVisitorList,
  getVisitorData,
  getUserList,
  addUser,
  getUser,
  editUser,
  editType,
  addType,

  getClassificationList,
  getClassificationDetail,
  addClassification,
  editClassification,
  deleteClassification,
  uploadImage,
  addArticle,
  editArticle,
  getArticleList,
  deleteArticle,
  getArticleDetail,

};
