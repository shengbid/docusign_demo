import React, {useState, useEffect} from 'react'
import { sendRequest } from '../../api/apiHelper';
import moment from 'moment'

const PassportSign = () => {
  const [signList, setSignList] = useState([])
  const dateTime = 'YYYY-MM-DD HH:mm:ss'

  // 获取已签约列表
  const getList = async () => {

    const body = {
      folderIds: 'completed, waiting_for_others, awaiting_my_signature', // 信封状态: 已完成,等待其他人签署,等待我签署
      fromDate: moment().subtract(30, 'days').format(), // 日期限制
    }
    try {
      const {data} = await sendRequest('/template/getEnvelopes', body);
      setSignList(data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div className='signList'>
      <h2 className='success'>签约成功</h2>
      <div className='list'>
        <div className='listtitle'>已签约列表</div>
        <ul className='enveloplist'>
        {signList && signList.length ? signList.map(item =>
          <li className='item' key={item.envelopeId}>
            <div className='title'>
              <span className='label'>
                合同名称:<span className='text'>{item.emailSubject}</span>
              </span>
              <span className='label'>
                发送人:<span className='text'>{item.sender.userName}</span>
              </span>
              <button className='btn'>查看合同</button>
              <button className='btn'>下载合同</button>
            </div>
            <div className='signers'>
              <div className='person'>签约人列表:</div>
              <table className='signer-table'>
                <thead>
                  <tr className='tr'>
                    <th style={{width: '20%'}}>姓名</th>
                    <th style={{width: '20%'}}>email</th>
                    <th style={{width: '20%'}}>签约时间</th>
                    <th style={{width: '20%'}}>签约状态</th>
                    <th style={{width: '20%'}}>操作</th>
                  </tr>
                </thead>
                <tbody>
                {item.recipients.signers.map(ss => 
                  <tr key={ss.recipientId} className='tr'>
                    <td>
                      {ss.name}
                    </td>
                    <td>
                      {ss.email}
                    </td>
                    <td>
                      {ss.signedDateTime ? moment(ss.signedDateTime).format(dateTime) : '-'}
                    </td>
                    <td>
                      {ss.status}
                    </td>
                    <td>
                      {ss.status === 'sent' ? <button>去签约</button> : <>-</>}
                    </td>
                  </tr>
                )}
                </tbody>
                </table>
            </div>
          </li>) : null}
        </ul>
      </div>
    </div>
  )
}

export default PassportSign