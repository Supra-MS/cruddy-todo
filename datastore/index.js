const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // invoke getNextUniqueId() using error first pattern, passing callback and error + iD
  counter.getNextUniqueId((err, id) => {
    // if error
    if (err) {
      // text log
      console.log('Unable to read counterId');
    } else {
    // overwrite current file using writeFile using given text EFCP (error first callback pattern)
      var newFilePath = `${this.dataDir}/${id}.txt`; // datastore/data/00001.txt
      fs.writeFile(newFilePath, text, (err, data) => {
        // if error
        if (err) {
          callback(new Error('Error in creating file'));
        } else {
          // invoke given callback with null, returning id and text
          console.log('id: ' + id + 'text: ' + text + 'data: ' + data);
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.readAll = (callback) => {
  // Review all files in directory
  fs.readdir(this.dataDir, (err, files) => {
    // if there are errors
    if (err) {
      callback(new Error('Error in reading files'));
    } else {
      // otherwise map all file objects
      var data = _.map(files, (text, id) => {
        console.log('readAll fs.readdir text: ' + text);
        text = text.slice(0, 5);
        return { id: text, text };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var newFilePath = `${this.dataDir}/${id}.txt`;
  fs.readFile(newFilePath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  /* var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  } */
  var newFilePath = `${this.dataDir}/${id}.txt`;
  fs.access(newFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(newFilePath, text, (err) => {
        if (err) {
          console.log('Error updating the todo: ', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
