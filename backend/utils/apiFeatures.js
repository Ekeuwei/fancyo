class APIFeatures {
    constructor (query, queryStr, searchFields){
        this.query = query;
        this.queryStr = queryStr;
        this.searchFields = searchFields;
    }

    search(){
        const keywordSingleField = this.queryStr.keyword? {
            firstName: {
                $regex: this.queryStr.keyword, 
                $options: 'i'
            }
        } : {}

        const keyword = this.queryStr.keyword? 
                        this.searchFields.map(field => ({[field]:{
                            $regex: this.queryStr.keyword, 
                            $options: 'i'
                        }}))
                        : [{}]

        // console.log(keyword);
        // this.query = this.query.find({...keywordSingleField})
        this.query = this.query.find({$or:[...keyword]})
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};

        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);

        // Advance filter for price, rating etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage -1);

        this.query.limit(resPerPage).skip(skip);

        return this;
    }
}

module.exports = APIFeatures;