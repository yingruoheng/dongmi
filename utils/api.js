const articleURL = 'https://yunji-1255930917.cos-website.ap-beijing.myqcloud.com';
// const apiURL = 'http://62.234.179.133:8080/yunji';
// const apiURL = 'http://188.131.165.85:8080';
// const apiURL = 'https://www.yunjiworks.com';
// const apiURL = 'http://10.8.5.245:8080';
const apiURL = 'http://10.8.5.243:8089';

const wxRequest = (params, url) => {
  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};




// const getReportList = (params) => {
//   wxRequest(params, `${apiURL}/article/report`);
// }

// const getTagById = (params) => {
//   wxRequest(params, `${apiURL}/auth/userTag?userId=${params.query.userId}`)
// }

// const getBlogById = (params) => {
//   wxRequest(params, `${articleURL}/${params.query.userAndArticleId}.html`);
// };

//向后台发送模版内容
const postContents = (params) => {
  wxRequest(params, `${apiURL}/sendContents/contents`)
};

//向后台发送评论
const postComments = (params) => {
  wxRequest(params, `${apiURL}/articles/addComment`)
};

//从后台获取模版明细
const getDetail = (params) => {
  wxRequest(params, `${apiURL}/articles/article?userId=${params.data.userId}&articleId=${params.data.articleId}&scenario=${params.data.scenario}`)
};

//向后台发送action
const postAction = (params) => {
  wxRequest(params, `${apiURL}/articles/addAction`)
};

//向后台发送interest
const postInterest = (params) => {
  wxRequest(params, `${apiURL}/article/addInterest`)
};

//判断是否已关注
const getInterest = (params) => {
  wxRequest(params, `${apiURL}/articles/getInterest?userId=${params.data.userId}&toUserId=${params.data.toUserId}&scenario=${params.data.scenario}`)
}

//根据userId获取浏览者的详细信息
const getReadersInfo = (params) => {
  wxRequest(params, `${apiURL}/articles/getReadersIdByarticleId?articleId=${params.data.articleId}&actionType=${params.data.actionType}`)
};

//向后台发送organizaiton
// const postOrganization = (params) => {
//   wxRequest(params, `${apiURL}/articles/addOrganization`)
// };

//向后台发送organizaiton
const postOrganization = (params) => {
  wxRequest(params, `${apiURL}/account/saveOrganization`)
};

//根据userId获取组织
const getOrganizationByUserId = (params) => {
  wxRequest(params, `${apiURL}/account/organizationList?userId=${params.data.userId}&circle=${params.data.circle}`)
}

//第一次获取推荐
const getFirstBlogList = (params) => {
  wxRequest(params, `${apiURL}/article/articles?pagesize=${params.query.pagesize}`);
};

//获取推荐
const getBlogList = (params) => {
  wxRequest(params, `${apiURL}/article/articles?articleId=${params.query.articleId}&pagesize=${params.query.pagesize}`);
};

// 第一次获取关注列表
const getFirstRecommendArticleList = (params) => {
  wxRequest(params, `${apiURL}/article/articlesRecommend?userId=${params.query.userId}&pagesize=${params.query.pagesize}`);
};

// 获取关注列表
const getRecommendArticleList = (params) => {
  wxRequest(params, `${apiURL}/article/articlesRecommend?userId=${params.query.userId}&articleId=${params.query.articleId}&pagesize=${params.query.pagesize}`);
};

// 第一次获取日程列表
const getFirstScheduleArticleList = (params) => {
  wxRequest(params, `${apiURL}/article/scheduleArticle?userId=${params.query.userId}&pagesize=${params.query.pagesize}`);
};

// 获取日程列表
const getScheduleArticleList = (params) => {
  wxRequest(params, `${apiURL}/article/scheduleArticle?userId=${params.query.userId}&articleId=${params.query.articleId}&pagesize=${params.query.pagesize}`);
};

//根据articleId删除文章
const deleteArticleById = (params) => {
  wxRequest(params, `${apiURL}/article/delete?articleId=${params.data.articleId}&userId=${params.data.userId}`);
}
//获取我的文章列表
const getMyArticleList = (params) => {
  wxRequest(params, `${apiURL}/article/myarticles?userId=${params.data.userId}&size=${params.data.size}`);
}

//获取用户文章数量
const getUserArticleNum = (params) => {
  wxRequest(params, `${apiURL}/article/amount?userId=${params.data.userId}`);
}
//获取用户关注数量
const getUserFocusNum = (params) => {
  wxRequest(params, `${apiURL}/account/amount?userId=${params.data.userId}`);
}
//获取关注用户的数量
const getfocususerNum = (params) => {
  wxRequest(params, `${apiURL}/account/focusme?userId=${params.data.userId}`);
}
//删除我的所有信息
const deleteme = (params) => {
  wxRequest(params, `${apiURL}/account/deleteUser?userId=${params.data.userId}`);
}
//获取我的关注列表
const getInterestList = (params) => {
  wxRequest(params, `${apiURL}/account/interest?userId=${params.data.userId}&size=${params.data.size}`);
}

//获取用户授权信息:post
const saveUserInfo = (params) => {
  wxRequest(params, `${apiURL}/auth/savewxinfo`);
}

//获取评论列表
const getCommentsByArtId = (params) => {
  wxRequest(params, `${apiURL}/articles/getComments?articleId=${params.data.articleId}`);
}

// 保存组织
const saveOrganization = (params) => {
  wxRequest(params, `${apiURL}/account/saveOrganization`);
}

// 删除组织
const deleteOrganization = (params) => {
  wxRequest(params, `${apiURL}/account/deleteOrganization`);
}

//获取mine页面数据
const getMineData = (params) => {
  wxRequest(params, `${apiURL}/account/mineData?userId=${params.data.userId}`);
}

//获取md文件内容
const getMdArticle = (params) => {
  wxRequest(params, `${apiURL}/file/mdDetail?mdUrl=${params.data.mdUrl}`);
}


module.exports = {
  apiURL,
  getBlogList,
  // getReportList,
  // getTagById,
  // getBlogById,
  postContents,
  postComments,
  getDetail,
  postAction,
  postInterest,
  getReadersInfo,
  postOrganization,
  getOrganizationByUserId,
  getFirstBlogList,
  getFirstRecommendArticleList,
  getRecommendArticleList,
  getInterest,
  deleteArticleById,
  getMyArticleList,
  getUserArticleNum,
  getUserFocusNum,
  getfocususerNum,
  deleteme,
  getInterestList,
  saveUserInfo,
  getCommentsByArtId,
  saveOrganization,
  deleteOrganization,
  getMineData,
  getMdArticle,
  getFirstScheduleArticleList,
  getScheduleArticleList
};
