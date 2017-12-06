const mongoose = require('mongoose');
const url = 'mongodb://www.ajoan.com:27017/test'
mongoose.Promise = global.Promise
mongoose.connect(url, { useMongoClient: true });
const bookSchema = mongoose.Schema({
    name: String,
    published: Boolean,
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now },
    email: String,
    // we don't know the type yet, so just give it mixed
    reviews: [mongoose.Schema.Types.Mixed]
})

// get photo from gravatar based on the email address.
bookSchema.virtual('authorPhotoUrl')
    .get(() => {
        console.log('email: ', this.email);
        if (!this.email) return null;
        let crypto = require('crypto'),
            email = this.email;
        email = email.trim().toLowerCase();
        let hash = crypto
            .createHash('md5')
            .update(email)
            .digest('hex')
        let gravatarBaseUrl = 'https://secure.gravatar.com/avatar/';
        console.log('did return');
        return gravatarBaseUrl + hash;
    })

// custom method
bookSchema.method({
    buy(quantity, customer, cb) {
        let bookToPurchase = this;
        console.log('buy')
        return cb();
    },
    refund(customer, cb) {
        console.log('refund')
        return cb();
    }
})

// Static methods are useful when we either don’t have a particular document object or we don’t need it:
bookSchema.static({
    getZeroInventoryReport(cb) {
        // run a query on all books and get the ones with zero inventory
        console.log('getZeroInventoryReport')
        let books = [];
        return cb(books);
    },
    getCountOfBooksById(bookId, cb) {
        // run a query and get the number of books left for a given book
        console.log('getCntOfBooksById')
        let count = 0
        return cb(count);
    }
})

// creating mongoose model
let Book = mongoose.model('Book', bookSchema);
Book.getZeroInventoryReport(() => { });
Book.getCountOfBooksById(123, () => { });

// creating a document mongoose object
let practicalNodeBook = new Book({
    name: 'Practical Node.js',
    // author and link will be ignored coz they aint in the schema
    author: 'Azat',
    email: 'hi@azat.co',
    link: 'https://github.com/azat-co/practicalnode',
    createdAt: Date.now()
})

// call custom methods
practicalNodeBook.buy(1, 2, () => { });
practicalNodeBook.refund(1, () => { });

console.log('Is new?', practicalNodeBook.isNew)
practicalNodeBook.save((err, results) => {
    if (err) {
        console.error(err);
        process.exit(1)
    } else {
        console.log('saved:', results)
        console.log('Is new?', practicalNodeBook.isNew)
        console.log('Book author photo: ', practicalNodeBook.authorPhotoUrl)
        // just output name field only, if not specify it, all displayed.
        Book.findOne({ _id: practicalNodeBook.id }, 'name', (err, bookDoc) => {
            console.log(bookDoc.toJSON())
            console.log(bookDoc.id)
            bookDoc.published = true
            bookDoc.save(console.log)
            // bookDoc.remove(process.exit);
        })
        // process.exit(0)
    }
})