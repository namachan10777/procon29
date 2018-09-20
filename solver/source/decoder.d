module procon.decoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
import procon.example;

auto decode(JSONValue json){
	Board board;
	int h = to!int(json.array.length);
	int w = to!int(json[0].array.length);
	foreach(y;0..h+2){
		foreach(x;0..w+2){
			if (y==0 || x==0 ||y==h+1 ||x == w+1){
				board.cells~=Cell(0,false,Color.Out);
				continue;
			}
			else {
				auto tmp=json.array[y-1].array[x-1];
				auto color = Color.Out;
				switch (tmp["color"].str){
					case "Red":color=Color.Red;break;
					case "Blue":color=Color.Blue;break;
					case "Out":color=Color.Out;break;
					case "Neut":color=Color.Neut;break;
					default :assert(false);
				}
				board.cells~=Cell(to!int(tmp["score"].integer),tmp["agent"].type==JSON_TYPE.TRUE,color);
			}
		}
	}
	board.width=w+2;
	return board;
}
/*デコードのテストは厳しい
unittest{
	auto json = parseJSON(ExampleJson); 
	auto tmp = decode(json);
	int width = width(json);
	writeln(width);
	for(int i;i<tmp.length;i++){
		write(tmp[i].color);
		if ((i+1)%width==0)writeln("");
	}
}
*/
