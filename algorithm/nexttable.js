/** Main Algorithm **/
var A = ["1","1","0","0","0"];  // Input array
var B = [-2,-2,-2,-2,-2];// Next table

B[0] = -1; // First value always -1
B[1] = (A[1]==A[0])? -1 : 0;

for(var failPos = 2; failPos < A.length; failPos++){
  var flag = false;
  addLine(">" + failPos);
  
  for(var i = 1; i < failPos; i++){
    addLine("-->" + i);
    var subA = A.slice(i, failPos);
    var subB = A.slice(0, subA.length);
    
    var same = compareStrArray(subA, subB);
    
    if(same){
      addLine("same? = " + same);
      if(A[failPos] !== A[subA.length]){
        addLine("inner same? = " + (A[failPos] === A[subA.length]));
        B[failPos] = subA.length;
        flag = true;
        break;
      }
      else if(subB.length === 1){
        addLine("sub length = 1");
        B[failPos] = 0;
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
    addLine(i + " == " + arr[i]);
  }
}

function addLine(string){
  var div = document.createElement("DIV");
  var t = document.createTextNode(string);
  div.appendChild(t);
  document.getElementById("result").appendChild(div);
}
