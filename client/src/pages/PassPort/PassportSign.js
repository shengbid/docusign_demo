import React, {useState, useEffect} from 'react'
import { sendRequest } from '../../api/apiHelper';

const PassportSign = () => {
  const [signList, setSignList] = useState([])

  // 获取已签约列表
  const getList = async () => {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() - 1
    if (month < 1) {
      month = 12
      year = year - 1
    }

    const body = {
      folderIds: 'completed, waiting_for_others, awaiting_my_signature', // 信封状态: 已完成,等待其他人签署,等待我签署
      fromDate: `${year}-${month}-1`, // 日期限制
    }
    try {
      const {data} = await sendRequest('/template/getEnvelopes', body);
      setSignList(data.map((item, index) => {
        return {
          ...item,
          id: `${Date.now()}${index}`
        }
      }))
      console.log(data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div className='signList'>
      <h2>签约成功</h2>
      <div className='list'>
        <div className='title'>已签约列表</div>
        <table className='signer-table'>
                <thead>
                  <tr className='theader'>
                    <th style={{width: '20%'}}>合同名称</th>
                    <th style={{width: '20%'}}>签约时间</th>
                    <th style={{width: '20%'}}>签约状态</th>
                    <th style={{width: '20%'}}>区号</th>
                    <th style={{width: '20%'}}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {signList && signList.length ? signList.map((item, index) =>
                    <tr key={item.id}>
                      <td>
                        {item.name}
                      </td>
                      <td>
                        {item.name}
                      </td>
                      <td>
                        {item.name}
                      </td>
                      <td>
                        {item.name}
                      </td>
                     
                      <td>
                        <button>查看</button>
                        <button>下载</button>
                      </td>
                    </tr>
                    ) : 
                    <tr className='nodata'>
                      <td colSpan={5}>请先选择模板</td>
                    </tr>}
                </tbody>
              </table>
      </div>
    </div>
  )
}

export default PassportSign