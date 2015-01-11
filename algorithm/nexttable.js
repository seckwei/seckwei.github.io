/** Main Algorithm **/
var A = ["A","C","A","C","B"];  // Input array
var B = [-2,-2,-2,-2,-2];// Next table

B[0] = -1; // First value always -1
B[1] = (A[1]==A[0])? -1 : 0;

for(var failPos = 2; failPos < A.length; i++){
  var flag = false;
  document.getElementById("result").innerHTML = (">" + failPos + "<br>");
  
  for(var i = 1; i < failPos-1; i++){
    document.getElementById("result").innerHTML = (">>" + i + "<br>");
    var subA = A.slice(i, failPos);
    var subB = A.slice(0, subA.length);
    
    var same = compareStrArray(subA, subB);
    
    if(same){
      if(A[failPos] !== A[subA.length]){
        B[failPos] = subA.length;
        flag = true;
        break;
      }
      else {
        continue
      }
    }
    else{
      continue
    }
  }
  
  if(!flag) B[failPos] = -1;
}
displayArray(B);

/** Helper Functions **/
function compareStrArray(arrA, arrB){
  if(arrA.length != arrB.length){
    return false;
  }
  else {
    for(var i = 0; i < arrA.length; i++){
      if(arrA[i] !== arrB[i]){
        return false;
      }
    }
    return true;
  }
}

function displayArray(arr){
  for(var i = 0; i < arr.length; i++){
    document.getElementById("result").innerHTML = (i + " == " + arr[i] + "<br>");
  }
}
