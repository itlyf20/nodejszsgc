const express=require("express")
const path=require("path")
const bodyParser=require("body-parser")
// cookie保存
const cookieParser=require("cookie-parser")
const app=express();
// 使用user数据库
const userModel=require("./mongo").UserModel
// 使用商品数据库
const productModel=require("./mongo").ProductModel
// 使用md5实现密码加密
const md5=require('blueimp-md5');
const filter={password:0}
// 生成token
const jwt=require("jsonwebtoken")
// 加载页面
app.use(express.static(path.join(__dirname,'..','public')));
// 使用它可以用req.body获取页面上的数据
app.use(bodyParser.json());
// 使用cookie
app.use(cookieParser())
const key="tangfenglingwoaini"

app.post("/register",function(req,res){
    const {username,password}=req.body
    //处理；//判断用户是否存在
    //查询：
    userModel.findOne({username},function (err,user) {
        if(user){
           res.send({code:1,msg:'此用户已存在'}) 
        }else{
            new userModel({username,password:md5(password)}).save(function(err,user){
                if(err){
                    res.send({
                        code:-1,
                        msg:err.message
                    })
                }else{
                    res.send({
                        code:0,
                        data:{
                            user_id:user._id
                        }
                    })
                }
            })
        }
    })
})

app.post('/login',function(req,res){
    // 获取前端提交过来的数据
    const {username,password}=req.body;
    // 访问数据库后将用户名和密码获取到，密码加密获取的
    userModel.findOne({username,password:md5(password)},filter,function(err,user){
        if(user){
            // 如果成功后，获得jsonwebtooken中的tooken
            // 这里的key是自己定义好的一个字符串（随便定义）
            const token=jwt.sign({username:username},key);
            // 通过cookie存储token
            res.cookie("token",token)
            // 登录成功后返回给前端的数据
            res.send({
                code:100,
                msg:'登录成功'
            })
        }else{
            // 登录失败
            res.send({
                code:101,
                msg:'登录失败'
            });
            return;
        }
    })
})
// 获取对应的数据
app.get("/getproduct",function(req,res){
    // 取cookie判断是否存在，如果存在后执行对应的数据展示操作
    jwt.verify(req.cookies.token,key,function(err,userObj){
        if(err){
            res.send({
                code:-1,
                msg:'请重新登录'
            })
            return;
        }else{
            productModel.find({},function(err,user){
                if(err){
                    res.send({
                        code:-1,
                        msg:'数据库连接错误'
                    })
                }else{
                    res.send({
                        code:0,
                        msg:'ok',
                        data:{
                            user:user
                        }
                    })
                }
            })
        }
    })
   
})

// 添加数据
app.post("/addproduct",function(req,res){
    new productModel(req.body).save(function(err,product){
        if(err){
            res.send({
                code:-1,
                msg:'数据库连接错误'
            })
        }else{
            res.send({
                code:0,
                msg:'ok',
                data:{
                    product:product
                }
            })
        }
    })
})
// 删除数据
app.post("/delproduct",function(req,res){
    new productModel({_id:req.body.product_id}).remove(function(err,product){
        if(err){
            res.send({
                code:-1,
                msg:'数据库连接错误'
            })
        }else{
            res.send({
                code:0,
                msg:'ok',
                data:{
                    product:product
                }
            })
        }
    })
})
app.listen(3000,function(err){
    if(err){
        console.log(err)
        return
    }else{
        console.log("http://localhost:3000")
    }
})