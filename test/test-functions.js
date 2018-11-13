function bubbleSort(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
        for(var j = 1; j<=i; j++){
            if(arr[j-1]>arr[j]){
                var temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}


function insertionSort(arr){
    var i, len = arr.length, el, j;

    for(i = 1; i<len; i++){
        el = arr[i];
        j = i;

        while(j>0 && arr[j-1]>toInsert){
            arr[j] = arr[j-1];
            j--;
        }

        arr[j] = el;
    }

    return arr;
}

function mergeSort(arr){
    var len = arr.length;
    if(len <2)
        return arr;
    var mid = Math.floor(len/2),
        left = arr.slice(0,mid),
        right =arr.slice(mid);
    return merge(mergeSort(left),mergeSort(right));
}

function siftDown(arr, start, end){
    var root = start,
        child = root*2 + 1,
        toSwap = root;
    while(child <= end){
        if(arr[toSwap] < arr[child]){
            swap(arr, toSwap, child);
        }
        if(child+1 <= end && arr[toSwap] < arr[child+1]){
            swap(arr, toSwap, child+1)
        }
        if(toSwap != root){
            swap(arr, root, toSwap);
            root = toSwap;
        }
        else{
            return;
        }
        toSwap = root;
        child = root*2+1
    }
}

