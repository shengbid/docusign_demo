# Node.js and React: MyGovernment Sample Application

## Introduction

Welcome to the MyGovernment sample app! MyGovernment is written using Node.js (server) and React (client), and shows a possible integration by a government agency with DocuSign eSignature.

You can find a live instance running at https://mygovernment.sampleapps.docusign.com/.

DocuSign嵌入式签名示例
功能: 在docusign创建模板,选择模板生成信封,用户签名,签名增加短信验证

前端: react   后端: node.js

## Running MyGovernment启动项目

前后端分别启动
前端: 
```
   client目录  
   npm i  
   npm start
``` 

后端:
```
   server目录
   npm i
   npm run server
```

1. Navigate to the application folder: **`cd sample-app-mygovernment-nodejs`**
2. Navigate to the server folder: **`cd server`**
3. To start the server and client at the same time: **`npm run dev`**
4. **Or,** to run the server and client separately:
   - In one terminal, navigate to the server folder (**`cd server`**) and run **`npm run server`**
   - In a separate terminal, navigate to the client folder (**`cd client`**) and run **`npm start`**
5. Open a browser to **http://localhost:8000**
