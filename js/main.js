const Charlist=['amber','albedo'];
var Weaponstat;
var Characters = new Array();
var Weapons = new Array();
var ArtifactSets = new Array();
var Artifactstat;
//現在選択中のキャラや武器など
var Character;
var Weapon;
var Artifact=new Array();
Artifact[0]=new Object();
Artifact[1]=new Object();
Artifact[2]=new Object();

var ArtifactSet;

var CharIndex;
var WeaponIndex;

var BaseATK;
var BaseHP;
var BaseDEF;
var ATK;
var DEF;
var HP;
var ATKconst;
var DEFconst;
var HPconst;
var TotalATK;
var TotalDEF;
var TotalHP;
    
var ER;
var EM;
    
var BaseDMG;

var DMG = new Array(5);//通常,重撃,落下,スキル,爆発
for(let i=0;i<5;i++){
    DMG[i] = new Array(8).fill(0);
}
var BaseCritRate;
var BaseCritDMG;
var CritRate = new Array(5);//通常,重撃,落下,スキル,爆発
for(let i=0;i<5;i++){
    CritRate[i] = new Array(8).fill(0);
}
var CritDMG = new Array(5);//通常,重撃,落下,スキル,爆発
for(let i=0;i<5;i++){
    CritDMG[i] = new Array(8).fill(0);
}

//CritDMG[0][0]→通常物理の会心ダメージ
//CritDMG[0][1]→通常炎の会心ダメージ
//1番目の引数→通常/重撃/落下/スキル/爆発
//2番目の引数→物理/炎/水/雷/氷/風/岩/草
var NormalTalentATK = new Array(6);
for(let i=0;i<5;i++){
    NormalTalentATK[i] = new Array(11).fill(0);
}
var NormalTalentDEF = new Array(6);
for(let i=0;i<5;i++){
    NormalTalentDEF[i] = new Array(11).fill(0);
}
var NormalTalentHP = new Array(6);
for(let i=0;i<5;i++){
    NormalTalentHP[i] = new Array(11).fill(0);
}

var NormalTalentLv;
var SkillLv;



window.onload = async function(){
    await init();
    addCharOption();
    updateCharacter();
    updateWeaponOption();
    updateWeapon();
}


async function init() {
    //キャラクターデータ読み込み
    var response;
    for(let i in Charlist){
	response = await fetch('database/character/'+Charlist[i]+'.json');
	const json = await response.json();
	Characters.push(json);
    }
//    console.log(Characters[0].Name);
    //武器データ読み込み
    response = await fetch('database/weapon/weapons.json');
    Weapons = await response.json();
    //武器ステータス読み込み
    response = await fetch('database/weapon/stats.json');
    Weaponstat = await response.json();

    //聖遺物データ読み込み
    response = await fetch('database/artifact/artifactstat.json');
    Artifactstat = await response.json();

}


function addCharOption(){
    const charselect = document.getElementById("charlist");

    for(let i in Charlist){
    	const option = document.createElement('option');
    	option.text = Characters[i].Name;
    	option.value = i;
    	console.log(Characters[i].Name);
    	charselect.appendChild(option);
    }
}

function updateWeaponOption(){
    const weaponselect = document.getElementById("weaponlist");
    Reset(weaponselect);

    const charselect = document.getElementById("charlist");
    const weapontype = Characters[charselect.value].Weapon;
    for(let i in Weapons){
	if( Weapons[i].Type == weapontype ){
    	    const option = document.createElement('option');
    	    option.text = Weapons[i].Name;
    	    option.value = Weapons[i].ID;
    	    console.log(Weapons[i].Name);
    	    weaponselect.appendChild(option);
	    WeaponIndex=i;
	}
    }
}

function updateCharacter(){
    const charselect = document.getElementById("charlist");
    Character = Characters[charselect.value];
    console.log("updateCharacter:"+Character.Name);
}

function updateWeapon(){
    const weaponselect = document.getElementById("weaponlist");
    const charselect = document.getElementById("charlist");
    const weaponlevelselect = document.getElementById("weaponlevel");
    const level = Number(weaponlevelselect.value);
    console.log(level);
    const weapontype = Character.Weapon;
    Weapon = Weapons[WeaponIndex];

    const BaseATKType = Weapon.BaseATKType;
    const Rarity = Weapon.Rarity;
    console.log(Rarity);
    for( let i in Weaponstat ){
	if(BaseATKType == Weaponstat[i].BaseATKType
	   && Rarity == Weaponstat[i].Rarity){
	    BaseATK=Weaponstat[i].BaseATK[level];
	    Weapon.BaseATK=BaseATK;
	    console.log(Weapon.BaseATK);

	}
    }
}

function updateArtifact(i){
    let position;
    switch(i){
    case 0:
	position = "sand";
	break;
    case 1:
	position = "goblet";
	break;
    case 2:
	position = "circlet";
	break;
    default:
	position = "sand";
    }
    const artifactselect = document.getElementById(position);
    const keys = Object.keys(Artifactstat);
    for(let j in keys ) {
	if(keys[j]==artifactselect.value){
	    Artifact[i][keys[j]] = Artifactstat[artifactselect.value];
	    console.log( "KEY:" + artifactselect.value + "Value:" + Artifact[i][keys[j]] );
	}else{
	    Artifact[i][keys[j]]=0;
	}
    }
}

function Reset(obj){
    while(obj.lastChild){
	obj.removeChild(obj.lastChild);
    }
}
