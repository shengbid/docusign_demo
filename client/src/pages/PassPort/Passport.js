import React, { useState, useEffect } from 'react';
import { handleError, sendRequest } from '../../api/apiHelper';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/request'

function Passport({ text }) {
  let navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const [templateList, setTemplateList] = useState([])
  const [singers, setSingers] = useState([])
  const [params, setParams] = useState({templateId: ''})

  const getTemplate = async () => {
    try {
      const {data} = await axios('/template/getTemplates');
      setTemplateList(data)

    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  useEffect(() => {
    getTemplate()
  }, [])

  // 选择模板 获取模板配置的签约人角色
  const changeTemplate = async(e) => {
    setParams({
      templateId: e.target.value,
    })
    const body = {
      templateId: e.target.value,
    };
    try {
      const {data} = await sendRequest('/template/getSigners', body);
      setSingers(data.map((item, index) => {
        return {
          ...item,
          id: `${Date.now()}${index}`
        }
      }))
      console.log(data)

    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  // 签约人数据改变
  const changeTable = (e, index) => {
    const {value, name} = e.target
    const arr = singers
    arr[index][name] = value
    arr[index].id = `${Date.now()}${index}`
    console.log(arr, value, name, index)
    setSingers(arr)
  }

  // Sends POST request to server to send envelope based on the
  // info the user provided in the form.
  async function handleSubmit() {
    console.log(params, singers)
    setRequesting(true);

    // Make request body
    // const body = {
    //   signerName: event.firstName + ' ' + event.lastName,
    //   signerEmail: event.signerEmail,
    // };

    // // Send request to server
    // try {
    //   const response = await sendRequest('/passportApplication', body);
    //   console.log(response.data);

    //   // Redirect to success screen
    //   navigate('/success');
    // } catch (error) {
    //   console.log(error);
    //   const errorPageText = handleError(error);
    //   navigate('/error', { state: errorPageText });
    // }
  }

  return (
    <section className="content-section">
      <div className="container">
        <div className="header-container">
          <h1>{text.title}</h1>
        </div>
        <div className="template-holder">
          <form>
            <div className="form-text-container">
              <label>Docusign模板列表</label>
            </div>
            <select onChange={changeTemplate}>
              {templateList.map(item => 
              <option key={item.templateId} value={item.templateId}>{item.name}</option>
              )}
            </select>

            <div className="form-text-container">
              <label>签约人列表</label>
            </div>
            <div className='singer-list' >
              <table className='signer-table'>
                <thead>
                  <tr className='theader'>
                    <th style={{width: '20%'}}>角色</th>
                    <th style={{width: '20%'}}>姓名</th>
                    <th style={{width: '20%'}}>Email</th>
                    <th style={{width: '20%'}}>区号</th>
                    <th style={{width: '20%'}}>电话</th>
                  </tr>
                </thead>
                <tbody>
                  {singers && singers.length ? singers.map((item, index) =>
                    <tr key={item.id}>
                      <td>
                        <input 
                          type="text" 
                          name="roleName" 
                          value={item.roleName} 
                          onChange={(e) => changeTable(e, index)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="name"
                          value={item.name} 
                          onChange={(e) => changeTable(e, index)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="email"
                          value={item.email} 
                          onChange={(e) => changeTable(e, index)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="countryCode"
                          value={item.countryCode} 
                          onChange={(e) => changeTable(e, index)} 
                          placeholder="例: +86" 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="phoneNumber"
                          value={item.phoneNumber}
                          onChange={(e) => changeTable(e, index)}
                          placeholder="例: 13512341234" 
                        />
                      </td>
                    </tr>
                    ) : 
                    <tr className='nodata'>
                      <td colSpan={5}>请先选择模板</td>
                    </tr>}
                </tbody>
              </table>
            </div>

            <div className="button-container">
              <button className="black-button" onClick={handleSubmit} disabled={requesting}>
                生成信封
              </button>
              <button
                className="grey-button"
                onClick={() => {
                  navigate('/index');
                }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Passport;
