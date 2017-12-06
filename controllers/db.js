
module.exports = function () {
    var writeDhtData = function (data) {
        /*
        fetch('http://localhost:3000/dht11', {
            method: 'post',
            body: JSON.stringify(data)
        }).then(res => {
            return res.json();
        }).catch(err => {
            console('write to db error: ', err);
        });
        */
    };
    var test = function(){};
    return {
        writeDhtData: writeDhtData,
        test: test
    };
};
