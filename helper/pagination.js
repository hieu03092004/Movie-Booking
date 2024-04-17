module.exports =()=>{
    if(req.query.page){
        pagination.currentPage=parseInt(req.query.page);
      }
      pagination.skip= (pagination.currentPage-1)*pagination.limitItems;
     
}