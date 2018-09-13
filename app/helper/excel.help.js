const fs  = require('fs'),
excelPort = require('excel-export');

const excel_helps = {
	toExcel : (filename, cols, data, callback) => {
		var conf   = {};  //只支持字母和数字命名
		conf.cols  = cols;
		conf.rows  = data;
		conf.name = "mysheet";
		var result = excelPort.execute(conf),
		uploadDir  = 'public/upload/',
		filePath   = uploadDir + filename + ".xlsx";

		fs.writeFile(filePath, result, 'binary', (err) => {
			if(err){
				console.log(err);
				callback(err, '');
			} else {
				console.log(filePath);
				// filePath = ' /' + filePath;
				callback(null, filePath);
			}
		});
	}
};

module.exports = excel_helps;
