module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  var currentDate = Date.now();
  var configuration = {
    paths: {
      targetDirectories: {
        final: '../../../target',
        work: 'grunt-work',
        images: 'images',
        cache: 'grunt-cache'
      }
    },
    fileNames: {
      templates: 'app-templates.js',
      appjs: 'application.js',
      appcss: 'application.css',
      releasejs: currentDate + '.min.js',
      releasecss: currentDate + '.min.css',
      librariesjs: 'app-libraries.js',
      librariesminjs: 'app-libraries.min.js',
      librariescss: 'app-libraries.css',
      lodash: 'lodash.js'
    },
    librariesDependencyJS: [
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/angular-cookies/angular-cookies.min.js'
    ],
    librariesDependencyCSS: [
    ],
    librariesDependencyLESS: [
      'node_modules/bootstrap/less/bootstrap.less'
    ],
    lodashFunctions: [
      'filter', 'each', 'remove', 'find', 'groupBy', 'capitalize'
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
        min: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.releasecss,
        libraries: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.librariescss
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
        lodash: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.lodash,
        templates: configuration.paths.targetDirectories.work + '/' + configuration.fileNames.templates
      },
      cache: {
        min: configuration.paths.targetDirectories.cache + '/' + configuration.fileNames.librariesminjs,
        libraries: configuration.paths.targetDirectories.cache + '/' + configuration.fileNames.librariesjs,
        lodash: configuration.paths.targetDirectories.cache + '/' + configuration.fileNames.lodash
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
  grunt.loadNpmTasks('grunt-lodash');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    configurationObj: configuration,
    clean: {
      dvtDirectory: configuration.paths.fullDirectories.dvt,
      workDirectory: configuration.paths.targetDirectories.work,
      releaseDirectory: configuration.paths.fullDirectories.release,
      cacheDirectory: configuration.paths.targetDirectories.cache
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
          "<%= configurationObj.paths.absoluteFiles.css.work.full %>": 'app.less'
        }
      }
    },
    lodash: {
			build: {
				dest: configuration.paths.absoluteFiles.js.cache.lodash,
				options: {
					modifier: 'modern',
					include: configuration.lodashFunctions,
					flags: [
						'--production'
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
          'apprun.js',
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
          'apprun.js',
          configuration.paths.fullDirectories.components + '/**/*.js', 
          configuration.paths.fullDirectories.routes + '/**/*.js'
        ],
        dest: configuration.paths.absoluteFiles.js.work.full
      },
      cssLibs: {
        src: [configuration.librariesDependencyCSS],
        dest: configuration.paths.absoluteFiles.css.work.libraries
      },
      javascriptLibs: {
        src: [configuration.librariesDependencyJS],
        dest: configuration.paths.absoluteFiles.js.cache.libraries
      },
      workWithLibraries: {
        src: [
          configuration.paths.absoluteFiles.js.cache.min,
          configuration.paths.absoluteFiles.js.work.min
        ],
        dest: configuration.paths.absoluteFiles.js.work.min
      }
    },
    cssmin: {
      target: {
        files: {
          "<%= configurationObj.paths.absoluteFiles.css.work.min %>": [
            configuration.paths.absoluteFiles.css.work.libraries,
            configuration.paths.absoluteFiles.css.work.full
          ]
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
                 .concat(configuration.paths.absoluteFiles.js.cache.lodash)
                 .concat(configuration.paths.absoluteFiles.js.cache.libraries)
                 .concat(configuration.paths.absoluteFiles.js.work.full)
                 .concat(configuration.paths.absoluteFiles.js.work.templates)
                 .concat(configuration.paths.targetDirectories.work + '/index-debug.html')
                 .concat(configuration.paths.absoluteFiles.css.work.libraries),
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
      prepareDebug: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              configuration.paths.absoluteFiles.js.cache.libraries,
              configuration.paths.absoluteFiles.js.cache.lodash
            ],
            dest: configuration.paths.targetDirectories.work
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
      libraries: {
        files: {
          "<%= configurationObj.paths.absoluteFiles.js.cache.min %>": [
            configuration.paths.absoluteFiles.js.cache.libraries
          ].concat(configuration.paths.absoluteFiles.js.cache.lodash)
        }
      },
      target: {
        files: {
          "<%= configurationObj.paths.absoluteFiles.js.work.min %>": [
            configuration.paths.absoluteFiles.js.work.full
          ].concat(configuration.paths.absoluteFiles.js.work.templates)
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
              configuration.paths.absoluteFiles.js.work.lodash,
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
  grunt.registerTask("quickinstall", [
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
    // Concaténation des librairies CSS de l'application
    "concat:cssLibs",
    // Minification du fichier CSS général dans work
    "cssmin:target",
    // Minification des fichiers JS avec les librairies dans work
    "uglify:target",
    // Concaténation librairies et fichiers JS
    "concat:workWithLibraries",
    // Copie du fichier librairie en cache dans work
    "copy:prepareDebug",
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
  
  // Installation complète HTML/CSS/JS
  grunt.registerTask("install", [
    // Vider le dossier de génération
    "clean:dvtDirectory",
    // Vider le dossier de travail
    "clean:workDirectory",
    // Vider le cache
    "clean:cacheDirectory",
    // Génération de apptemplates.js dans work avec tous les HTML
    "ngtemplates:webapp",
    // Génération de application.css dans work avec tous les LESS
    "less:compile",
    // Génération de lodash
    "lodash:build",
    // Concaténation des JS de l'application dans application.js
    "concat:javascriptWork",
    // Concaténation des librairies JS de l'application
    "concat:javascriptLibs",
    // Concaténation des librairies CSS de l'application
    "concat:cssLibs",
    // Minification du fichier CSS général dans work
    "cssmin:target",
    // Minification des librairies
    "uglify:libraries",
    // Minification des fichiers JS avec les librairies dans work
    "uglify:target",
    // Concaténation librairies et fichiers JS
    "concat:workWithLibraries",
    // Copie du fichier librairie en cache dans work
    "copy:prepareDebug",
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
    // Vider le cache
    "clean:cacheDirectory",
    // Génération de apptemplates.js dans work avec tous les HTML
    "ngtemplates:webapp",
    // Génération de application.css dans work avec tous les LESS
    "less:compile",
    // Génération de lodash
    "lodash:build",
    // Concaténation des JS de l'application dans application.js
    "concat:javascriptWorkProd",
    // Concaténation des librairies JS de l'application
    "concat:javascriptLibs",
    // Concaténation des librairies CSS de l'application
    "concat:cssLibs",
    // Minification du fichier CSS général dans work
    "cssmin:target",
     // Minification des librairies
    "uglify:libraries",
    // Minification des fichiers JS avec les librairies dans work
    "uglify:target",
    // Concaténation librairies et fichiers JS
    "concat:workWithLibraries",
    // Copie du fichier librairie en cache dans work
    "copy:prepareDebug",
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