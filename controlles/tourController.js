const fs = require('fs')
const path = require('path')

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, `../after-section-06/dev-data/data/tours-simple.json`)));

// check ID 
exports.checkID = (req,res,next,val)=>{
    console.log(">>> check IDParams:", val);
    console.log('>> check id:', req.params);
    let id = req.params.id * 1
    if (!id) {
        return res.status(404).json({
            status: 'false',
            mgs: 'chỉ nhập số'
        })
    }

    if (id > tours.length) {
        return res.status(404).json({
            status: 'false',
            mgs: 'Invaild ID'
        })
    }

    next();

}

// check Body
exports.checkBody = (req,res,next)=>{
    if( !req.body.name || !req.body.price){
        return res.status(400).json({
            status:'fail',
            msg: ' Mising name of price'
        })
    }
    next()
}


// handell route tour
exports.getATuor = (req, res) => {
    const id = req.params.id * 1
    let aTour = tours.find(el => { return el.id === id })
    res.status(200).json({
        status: 'success!',
        data: {
            aTour
        }
    })
}

exports.getAllTuor = (req, res) => {
    console.log('>>> check time request: ', req.requestTime);
    res.status(200).json({
        status: 'success!',
        timeRequest: req.requestTime,
        resutl: tours.length,
        data: {
            tours
        }
    })
}

exports.postTour = (req, res) => {
    let newID = tours[tours.length - 1].id + 1;

    let newTours = Object.assign({ id: newID }, req.body);

    tours.push(newTours);

    fs.writeFile(path.join(__dirname, `../after-section-06/dev-data/data/tours-simple.json`), JSON.stringify(tours), er => {
        if (er) { return console.log(er); }
        res.status(200).json({
            status: 'success!',
            resutl: newTours.length,
            data: {
                newTours
            }
        })
    })
}

exports.patchATour = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'Đã cập nhật thành công !'
        }
    })
}

exports.deleteATour = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'Đã cập nhật thành công !'
        }
    })
}

