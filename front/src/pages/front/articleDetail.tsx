import { useEffect, useState } from 'react'
import { getArticleDetail } from '@/api'
import './index.less'
import { useSearchParams } from 'react-router-dom'
import logo from "../../assets/images/knobullpic.jpg";

export default function ArticleDetail() {
  const [detail, setDetail] = useState<any>({})
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    getArticleDetailData()
  }, [])

  const getArticleDetailData = () => {
    getArticleDetail({ id: searchParams.get('id') }).then(res => {
      setDetail(res.data)
    })
  }

  return (
    <div>
      <div className="top_header"></div>
      <div className="header__Container">
        <img className="logo" src={logo} />
        <div className='title'>Article Detail</div>
      </div>
      <div className="article_detail">
        <div className="title">{detail.title}</div>
        <div className="desc">{detail.desc}</div>
        <img className='banner' src={detail.banner} alt="" />
        <div className='content' dangerouslySetInnerHTML={{__html: detail.content}}></div>
      </div>
    </div>
  )
}

ArticleDetail.route = {
  [MENU_PATH]: '/front/articleDetail',
  [MENU_LAYOUT]: 'FULLSCREEN'
}
