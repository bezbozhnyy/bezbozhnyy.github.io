var autoprefix 	= require( 'gulp-autoprefixer' );
var concat		= require( 'gulp-concat');
var cssnano    	= require( 'gulp-cssnano'      );
var gulp       	= require( 'gulp'              );
var modernizr  	= require( 'gulp-modernizr'    );
var notify     	= require( 'gulp-notify'       );
var plumber    	= require( 'gulp-plumber'      );
var sass       	= require( 'gulp-sass'         );
var sourcemaps 	= require( 'gulp-sourcemaps'   );
var uglify     	= require( 'gulp-uglify'       );


function onError( error ){
	notify.onError( {
		title:    "Gulp",
		subtitle: "Failure!",
		message:  "Error: <%= error.message %>",
		sound:    "Beep"
	} )( error );
	this.emit('end');
}

gulp.task('styles', function() {
	return gulp.src( 'css/src/*' )
		.pipe( plumber( { errorHandler: onError } ) )
		.pipe( sourcemaps.init()                    )
		.pipe( sass()                               )
		.pipe( autoprefix()                         )
		.pipe( cssnano()                            )
		.pipe( sourcemaps.write( '../maps/' )       )
		.pipe( gulp.dest('css/dest/')      )
		.pipe( notify({
			title: "Gulp SASS",
			subtitle: 'Success',
			message: "SASS Compiled"
		}) )
});

gulp.task( 'javascript-static', function(){
	return gulp.src( 'js/*.js' )
		.pipe( plumber( { errorHandler: onError } ) )
		.pipe( uglify()                             )
		.pipe( gulp.dest( 'js/min' )        )
		.pipe( notify( {
			title: "Gulp JavaScript Static",
			subtitle: "Success Static",
			message: "JavaScript Static minified"
		}))
})

gulp.task( 'modernizr', ['javascript-static'], function(){
	/* This detects Modernizr features used in .js files in /js and
	 * builds a custom minified modernizr.js file with only the detected tests.
	 * If you are using a Modernizr API option, you will need to add that to the
	 * options array.
	 */
	return gulp.src([ 'js/*.js'])
		.pipe(
			modernizr(
				{
					"files": [ "js/*.js"],
					"options": [
						// this is not a complete list.
						// "setClasses
						// "addTest
						// "html5printshiv",
						// "testProp
						// "fnBind",
						// "hasEvent
					]
				}
			)
		)
		.pipe( uglify() )
		.pipe( gulp.dest("js/min") )
})

//Watch task
gulp.task('default',function() {
	gulp.watch( 'css/src/*.{sass,scss}', ['styles']);
	gulp.watch( 'js/*.js', ['modernizr'] );
});

//Build task
gulp.task('build', ['styles','modernizr']);
