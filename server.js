const express = require('express');
const fs = require('fs')
const app = express();
const port = 8080;

app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/after-section-06/dev-data/data/tours-simple.json`));
const getATuor =  (req, res) => {
    console.log('>> check id:', req.params);
    let id = req.params.id * 1

    if (!id) {
        return res.status(404).json({
            status: 'false',
            mgs: 'chỉ nhập số'
        })
    }

    let aTour = tours.find(el => { return el.id === id })
    if (!aTour) {
        return res.status(404).json({
            status: 'false',
            mgs: 'Invaild ID'
        })
    }

    res.status(200).json({
        status: 'success!',
        data: {
            aTour
        }
    })
}
const getAllTuor = (req, res) => {
    res.status(200).json({
        status: 'success!',
        resutl: tours.length,
        data: {
            tours
        }
    })
}
const postTour =  (req, res) => {
    let newID = tours[tours.length - 1].id + 1;

    let newTours = Object.assign({ id: newID }, req.body);

    tours.push(newTours);

    fs.writeFile(`${__dirname}/after-section-06/dev-data/data/tours-simple.json`, JSON.stringify(tours), er => {
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
const patchATour = (req, res) => {
    console.log('>> check id:', req.params);
    let id = req.params.id * 1

    if (!id) {
        return res.status(404).json({
            status: 'false',
            mgs: 'chỉ nhập số'
        })
    }

    if (req.params.id > tours.length) {
        return res.status(404).json({
            status: 'false',
            mgs: 'Invaild ID'
        })
    }

    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'Đã cập nhật thành công !'
        }
    })
}
const deleteATour = (req, res) => {
    console.log('>> check id:', req.params);
    let id = req.params.id * 1

    if (!id) {
        return res.status(404).json({
            status: 'false',
            mgs: 'chỉ nhập số'
        })
    }

    if (req.params.id > tours.length) {
        return res.status(404).json({
            status: 'false',
            mgs: 'Invaild ID'
        })
    }

    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'Đã cập nhật thành công !'
        }
    })
}


// cách 1
// app.get('/api/v1/tours/',getAllTuor)
// app.post('/api/v1/tours',postTour)
// app.patch('/api/v1/tours/:id', patchATour)
// app.delete('/api/v1/tours/:id', deleteATour)
// app.get('/api/v1/tours/:id',getATuor)


// cách 2
app.route('/api/v1/tours/').get(getAllTuor).post(postTour)

app.use((req,res,next)=>{
    console.log('lời chào từ middellwere !');
    next()
})

app.route('/api/v1/tours/:id').get(getATuor).delete(deleteATour).patch(patchATour)


app.listen(port, console.log(`127.0.0.1:${port}`))
