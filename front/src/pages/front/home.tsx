import { useEffect, useState } from 'react'
import { MapKey, ResponseUserInfo } from '@/types'
import { getClassificationList, getArticleList } from '@/api'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import './index.less'

export default function Home() {
  const [classifyData, setClassifyData] = useState<ResponseUserInfo[]>([])
  const [classifyActive, setClassifyActive] = useState<number>(0)
  const [list, setList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  /* const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 3,
    categoryId: null
  }) */
  let params = {
    page: 1,
    pageSize: 3,
    categoryId: null
  }
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    getClassificationData()
    getArticleData()
  }, [])

  const getClassificationData = () => {
    getClassificationList().then(res => {
      setClassifyData([{ name: 'all', _id: -1 }].concat(res.data))
    })
  }

  const getArticleData = (refresh) => {
    if (loading) return false
    setLoading(true)
    getArticleList(params).then(res => {
      const data = refresh ? res.data : list.concat(res.data)
      setList(data)
      if (data.length >= res.total) {
        setHasMore(false)
      } else {
        params.page = params.page + 1
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const articleDetail = (id) => {
    navigate(`/front/articleDetail?id=${id}`)
  }

  const changeClassify = async (id, index) => {
    setClassifyActive(index)
    setHasMore(e => {
      e = true
      return e
    })
    params = {
      page: 1,
      pageSize: 3,
      categoryId: id === -1 ? null : id
    }
    getArticleData(true)
    setList([])
  }

  return (
    <div>
      <div className="top_header"></div>
      <div className="header__Container">
        <img className="logo" src="https://www.usnews.com/static/img/usn-logo-large.svg" />
        <div className="classify">
          {classifyData.map((item, index) => {
            return (
              <div className="classify_item" style={{color: classifyActive === index ? 'red' : '#fff'}} key={item._id} onClick={() => changeClassify(item._id, index)}>
                {item.name}
              </div>
            )
          })}
        </div>
        <div className="button">Sign In</div>
      </div>
      <div className="content">
        <InfiniteScroll
          dataLength={list.length}
          next={getArticleData}
          hasMore={hasMore}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          loader={<h4>Loading...</h4>}>
          {list.length > 0 ? list.map(item => (
            <div className='article_item' key={item._id}>
              <div className='left'>
                <div className="title" onClick={() => articleDetail(item._id)}>{item.title}</div>
                <div className="desc">{item.desc}</div>
              </div>
              <img className='banner' src={item.banner} alt="" onClick={() => articleDetail(item._id)}/>
            </div>
          )) : <div style={{fontWeight: 'bold', textAlign: 'center', fontSize: '20px'}}>no data</div>}
        </InfiniteScroll>
      </div>
    </div>
  )
}

Home.route = {
  [MENU_PATH]: '/front/home',
  [MENU_LAYOUT]: 'FULLSCREEN'
}
