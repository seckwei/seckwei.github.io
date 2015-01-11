var A = ["A","C","A","C","B"];  // Input array
var B = new Array(A.length);// Next table

B[0] = -1; // First value always -1

// Loop through A from position 1 to N
for(var i = 1; i < A.length-1; i++){
  var flag = false;
  
  for(var j = 1; j < i-1 && !flag; j++){
    flag = true;
    
    for(var k = 0; A.length-1-j-1; k++){
      if(A[k] != A[j]){
        flag = false;
        break;
      }
      pos = k+1;
    }
  }
  
  B[i] = (flag)? pos : -1;
}

for(var i = 0; i < B.length; i++){
  document.write(i + " - " + B[i] + "\n");
}
