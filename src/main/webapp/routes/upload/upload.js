app.controller('UploadCtrl', ['$scope', 'dataServiceUrl', '$sce', 'DataService', 'DefaultDataCtrlProperties', '$location', '$timeout', 'AccountService', function ($scope, dataServiceUrl, $sce, DataService, DefaultDataCtrlProperties, $location, $timeout, AccountService) {            
  $scope.upload = angular.extend({}, DefaultDataCtrlProperties, {
    url: $sce.trustAsResourceUrl(dataServiceUrl + '/user/upload'),
    data: {},
    info: {
      progress: 0,
      downloadInProgress: false,
      cropPhase: false
    },
    validateImage: function() {
      $scope.upload.loadingImage = true;
      DataService.post('/user/validateUpload', {
        data: $scope.upload.cropper.getCroppedCanvas().toDataURL()
      }).then(function(data) {
        $location.path('/account');
        AccountService.client().imagePath = data.imagePath;
        $scope.upload.loadingImage = false;
      }, function (data) {
        $scope.upload.loadingImage = false;
        $scope.upload.errorData = data;
      });
    },
    getProgressLabel: function() {
      if (this.progress !== 100) {
        return "Téléchargement en cours : " + String(Math.round(this.progress)) + "%";
      } else {
        return "Téléchargement terminé";
      }
    }
  });
  var dropzone = new Dropzone("#imageUpload", {
    url: $scope.upload.url,
    withCredentials: true,
    acceptedFiles: 'image/*',
    previewsContainer: false,
    thumbnailWidth: null,
    thumbnailHeight: null,
    createImageThumbnails: false,
    success: function(file, response) {
      $scope.$apply(function () {        
        $scope.upload.data = response;
        $scope.upload.imageData = $scope.upload.data.fileUrl;
        $scope.upload.data.imageWidth = file.width;
        $scope.upload.data.imageHeight = file.height;
        $scope.upload.info.downloadInProgress = false;
        $timeout(function() {
          $scope.upload.cropper = new Cropper(document.querySelector('#imagePreview'), {
            aspectRatio: 1,
            zoomable: false,
            modal: false,
            guides: false,
            responsive: false
          });
        }, 300);
      });
    },
    uploadprogress: function(file, progress) {
      $scope.$apply(function () {
        $scope.upload.info.downloadInProgress = true;
        $scope.upload.progress = progress;
      });
    }
  });
  $scope.upload.loading = false;
}]);