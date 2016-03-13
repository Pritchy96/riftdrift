  var totalSize;

  this.generatePoints = function(width, height, rough) {  
    var p1, p2, p3, p4;  
    var points = [];
    for (var x = 0; x < width; x++)
    {
      points[x] = [];
    }
    //give corners random colors
    p1 = Math.random();
    p2 = Math.random();
    p3 = Math.random();
    p4 = Math.random();
    roughness = rough;
    totalSize = width + height;
    this.splitRect(points, 0, 0, width, height, p1, p2, p3, p4);
    return points;
  }

  this.splitRect = function(points, x, y, width, height, p1, p2, p3, p4) {  
    var side1, side2, side3, side4, center;
    var transWidth = ~~(width / 2);
    var transHeight = ~~(height / 2);

    //as long as square is bigger then a pixel..
    if (width > 1 || height > 1)
    {  
      //center is just an average of all 4 corners
      center = ((p1 + p2 + p3 + p4) / 4);
      
      //randomly shift the middle point 
      center += this.shift(transWidth + transHeight);
      
      //sides are averages of the connected corners
      //p1----p2
      //|     |
      //p4----p3
      side1 = ((p1 + p2) / 2);
      side2 = ((p2 + p3) / 2);
      side3 = ((p3 + p4) / 2);
      side4 = ((p4 + p1) / 2);
      
      //its possible that middle point was moved out of bounds so correct it here
      center = this.normalize(center);
      side1 = this.normalize(side1);
      side2 = this.normalize(side2);
      side3 = this.normalize(side3);
      side4 = this.normalize(side4);
      
      //repear operation for each of 4 new squares created
      //recursion, baby!
      this.splitRect(points, x, y, transWidth, transHeight, p1, side1, center, side4);
      this.splitRect(points, x + transWidth, y, width - transWidth, transHeight, side1, p2, side2, center);
      this.splitRect(points, x + transWidth, y + transHeight, width - transWidth, height - transHeight, center, side2, p3, side3);
      this.splitRect(points, x, y + transHeight, transWidth, height - transHeight, side4, center, side3, p4);
    }
    else 
    {
      //when last square is just a pixel, simply average it from the corners
      points[x][y]= (p1 + p2 + p3 + p4) / 4;
    }
  }

  this.normalize = function(val)  
  {  
    return (val < 0) ? 0 : (val > 1) ? 1 : val;
  }
  
  this.shift = function(smallSize)
  { 
    return (Math.random() - 0.5) * smallSize / totalSize * roughness;
  }