require('proof')(6, require('cadence/redux')(prove))

function prove (async, assert) {
    var values = [ 'a', 'b', 'c' ]
    var advance = require('../..')
    var iterator
    function extractor (record) { return record }
    function comparator (a, b) { return a < b ? -1 : a > b ? 1 : 0 }
    async(function () {
        iterator = advance.reverse(extractor, comparator, values)
        iterator.next(async())
    }, function (more) {
        assert(more, 'more')
        var items = [], item
        while (item = iterator.get()) {
            items.push(item)
        }
        assert(items, [ 'c', 'b', 'a' ], 'next')
        iterator.next(async())
    }, function (more) {
        assert(!more, 'no more')
    }, function () {
        iterator.unlock(async())
    }, function () {
        iterator = advance.reverse(extractor, comparator, values, 1)
        iterator.next(async())
    }, function (more) {
        assert(more, 'more')
        var items = [], item
        while (item = iterator.get()) {
            items.push(item)
        }
        assert(items, [ 'b', 'a' ], 'next with index')
        iterator.next(async())
    }, function (more) {
        assert(!more, 'no more with index')
    }, function () {
        iterator.unlock(async())
    })
}
