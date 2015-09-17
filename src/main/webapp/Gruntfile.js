module.exports = function (grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  var currentDate = Date.now();
  var configuration = {
    paths: {
      targetDirectories: {
        final: '../../../target',
        work: 'grunt-work',
        images: 'images'
      }
    },
    fileNames: {
      templates: 'app-templates.js',
      appjs: 'application.js',
      appcss: 'application.css',
      releasejs: currentDate + '.min.js',
      releasecss: currentDate + '.min.css',
      librariesjs: 'app-libraries.js'
    },
    librariesDependencyJS: [
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/angular-cookies/angular-cookies.min.js'
    ]
  };
  
  configuration.paths.fullDirectories = {
    debug: configuration.paths.targetDirectories.final + '/debug',
    release: configuration.paths.targetDirectories.final + '/release',
    dvt: configuration.paths.targetDirectories.final + '/dvt',
    components: 'components',
    routes: 'routes',
    services: 'services',
    images: '../resources/' + configuration.paths.targetDirectories.images
  };
  
  configuration.paths.absoluteFiles = {
    css: {
      work: {
        full: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.appcss,
        min: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.releasecss
      },
      target: {
        release: configuration.paths.fullDirectories.release + '/' + configuration.fileNames.releasecss,
        debug: configuration.paths.fullDirectories.debug + '/' + configuration.fileNames.releasecss,
        dvt: configuration.paths.fullDirectories.dvt + '/' + configuration.fileNames.releasecss
      }
    },
    js: {
      work: {
        full: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.appjs,
        min: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.releasejs,
        libraries: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.librariesjs,
        templates: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.templates
      }
    },
    images: {
      debug: configuration.paths.fullDirectories.debug + '/' + configuration.paths.targetDirectories.images,
      release: configuration.paths.fullDirectories.release + '/' + configuration.paths.targetDirectories.images,
      dvt: configuration.paths.fullDirectories.dvt + '/' + configuration.paths.targetDirectories.images,
    }
  };
  
	grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    configurationObj: configuration,
    clean: {
      dvtDirectory: configuration.paths.fullDirectories.dvt,
      workDirectory: configuration.paths.targetDirectories.work,
      releaseDirectory: configuration.paths.fullDirectories.release
    },
    ngtemplates: {
      webapp: {
        src: [
          configuration.paths.fullDirectories.components + '/**/*.html', 
          configuration.paths.fullDirectories.routes + '/**/*.html'
        ],
        dest: configuration.paths.absoluteFiles.js.work.templates,
        options: {
          module: 'cv-webapp'
        }
      }
    },
    less: {
      compile: {
        files: {
          "<%= configurationObj.paths.absoluteFiles.css.work.full %>": [
            'variables.less', 
            'global.less', 
            configuration.paths.fullDirectories.components + '/**/*.less', 
            configuration.paths.fullDirectories.routes + '/**/*.less'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';\n'
      },
      javascriptWork: {
        src: [
          'app.js', 
          configuration.paths.fullDirectories.services + '/*.js',
          '!' + configuration.paths.fullDirectories.services + '/DataServiceUrlProd.js',
          configuration.paths.fullDirectories.components + '/**/*.js', 
          configuration.paths.fullDirectories.routes + '/**/*.js'
        ],
        dest: configuration.paths.absoluteFiles.js.work.full
      },
      javascriptWorkProd: {
        src: [
          'app.js', 
          configuration.paths.fullDirectories.services + '/*.js',
          '!' + configuration.paths.fullDirectories.services + '/DataServiceUrlDvt.js',
          configuration.paths.fullDirectories.components + '/**/*.js', 
          configuration.paths.fullDirectories.routes + '/**/*.js'
        ],
        dest: configuration.paths.absoluteFiles.js.work.full
      },
      javascriptLibs: {
        src: [configuration.librariesDependencyJS],
        dest: configuration.paths.absoluteFiles.js.work.libraries
      }
    },
    cssmin: {
      target: {
        files: {
          "<%= configurationObj.paths.absoluteFiles.css.work.min %>": [configuration.paths.absoluteFiles.css.work.full]
        }
      }
    },
    copy: {
			debug: {
				files: [
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.absoluteFiles.css.work.full]
                 .concat(configuration.paths.absoluteFiles.js.work.libraries)
                 .concat(configuration.paths.absoluteFiles.js.work.full)
                 .concat(configuration.paths.absoluteFiles.js.work.templates)
                 .concat(configuration.paths.targetDirectories.work + '/index-debug.html'),
            dest: configuration.paths.fullDirectories.debug
          }, 
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.fullDirectories.images + '/*.*'], 
            dest: configuration.paths.absoluteFiles.images.debug 
          }
        ]
			},
      release: {
        files: [
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.absoluteFiles.css.work.min], 
            dest: configuration.paths.fullDirectories.release
          },
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.absoluteFiles.js.work.min], 
            dest: configuration.paths.fullDirectories.release 
          },
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.fullDirectories.images + '/*.*'], 
            dest: configuration.paths.absoluteFiles.images.release
          },
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.targetDirectories.work + '/index.html'], 
            dest: configuration.paths.fullDirectories.release 
          }
        ]
      },
      dvt: {
        files: [
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.absoluteFiles.css.work.min], 
            dest: configuration.paths.fullDirectories.dvt
          },
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.absoluteFiles.js.work.min], 
            dest: configuration.paths.fullDirectories.dvt 
          },
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.fullDirectories.images + '/*.*'], 
            dest: configuration.paths.absoluteFiles.images.dvt
          },
          { 
            expand: true, 
            flatten: true, 
            src: [configuration.paths.targetDirectories.work + '/index.html'], 
            dest: configuration.paths.fullDirectories.dvt 
          }
        ]
      }
		},
    uglify: {
      options: {
        exportAll: true
      },
      target: {
        files: {
          "<%= configurationObj.paths.absoluteFiles.js.work.min %>": [
            configuration.paths.absoluteFiles.js.work.libraries
          ].concat(configuration.paths.absoluteFiles.js.work.full)
           .concat(configuration.paths.absoluteFiles.js.work.templates)
        }
      }
    },
    htmlbuild: {
      release: {
        src: 'index.html',
        dest: configuration.paths.targetDirectories.work,
        options: {
          beautify: true,
          relative: true,
          scripts: {
            bundle: [
              configuration.paths.targetDirectories.work + '/*.min.js'
            ]
          },
          styles: {
            bundle: [
              configuration.paths.targetDirectories.work + '/*.min.css'
            ]
          }
        }
      },
      debug: {
        src: 'index.html',
        dest: configuration.paths.targetDirectories.work,
        options: {
          beautify: true,
          relative: true,
          scripts: {
            bundle: [
              configuration.paths.absoluteFiles.js.work.libraries,
              configuration.paths.absoluteFiles.js.work.full,
              configuration.paths.absoluteFiles.js.work.templates
            ]
          },
          styles: {
            bundle: [
              configuration.paths.targetDirectories.work + '/*.css',
              '!' + configuration.paths.targetDirectories.work + '/*.min.css'
            ]
          }
        }
      }
    },
    rename: {
      indexWorkDebug: {
        files: [
					{
            src: configuration.paths.targetDirectories.work + '/index.html', 
            dest: configuration.paths.targetDirectories.work + '/index-debug.html'
          }
				]
			},
      indexDebug: {
        files: [
					{
            src: configuration.paths.fullDirectories.debug + '/index-debug.html', 
            dest: configuration.paths.fullDirectories.debug + '/index.html'
          }
				]
      }
		}
  });
  
  // Installation complète HTML/CSS/JS
  grunt.registerTask("install", [
    // Vider le dossier de génération
    "clean:dvtDirectory",
    // Vider le dossier de travail
    "clean:workDirectory",
    // Génération de apptemplates.js dans work avec tous les HTML
    "ngtemplates:webapp",
    // Génération de application.css dans work avec tous les LESS
    "less:compile",
    // Concaténation des JS de l'application dans application.js
    "concat:javascriptWork",
    // Concaténation des librairies JS de l'application
    "concat:javascriptLibs",
    // Minification du fichier CSS général dans work
    "cssmin:target",
    // Minification des fichiers JS avec les librairies dans work
    "uglify:target",
    // Transformation du fichier HTML Debug
    "htmlbuild:debug",
    // On renomme le fichier en index-debug.html
    "rename:indexWorkDebug",
    // Transformation du fichier HTML
    "htmlbuild:release",
    // Copie des fichiers pour debug dans target
    "copy:debug",
    // Renommage du index-debug en index.html
    "rename:indexDebug",
    // Copie des fichiers de production dans dvt
    "copy:dvt",
    // Vider le dossier de travail
    "clean:workDirectory"
  ]);
  
  // Installation complète HTML/CSS/JS pour la production
  grunt.registerTask("installprod", [
    // Vider le dossier de génération
    "clean:releaseDirectory",
    // Vider le dossier de travail
    "clean:workDirectory",
    // Génération de apptemplates.js dans work avec tous les HTML
    "ngtemplates:webapp",
    // Génération de application.css dans work avec tous les LESS
    "less:compile",
    // Concaténation des JS de l'application dans application.js
    "concat:javascriptWorkProd",
    // Concaténation des librairies JS de l'application
    "concat:javascriptLibs",
    // Minification du fichier CSS général dans work
    "cssmin:target",
    // Minification des fichiers JS avec les librairies dans work
    "uglify:target",
    // Transformation du fichier HTML Debug
    "htmlbuild:debug",
    // On renomme le fichier en index-debug.html
    "rename:indexWorkDebug",
    // Transformation du fichier HTML
    "htmlbuild:release",
    // Copie des fichiers pour debug dans target
    "copy:debug",
    // Renommage du index-debug en index.html
    "rename:indexDebug",
    // Copie des fichiers de production dans release
    "copy:release",
    // Vider le dossier de travail
    "clean:workDirectory"
  ]);
};