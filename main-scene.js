/***** MIRROR SCENE******/
window.Mirror_Scene = window.classes.Mirror_Scene = class Mirror_Scene extends Scene_Component {
  constructor(context, control_box) {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box);
    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(
          new Movement_Controls(context, control_box.parentElement.insertCell())
      );
    this.mycontext = context;

    context.globals.graphics_state.camera_transform = Mat4.look_at(
        Vec.of(0, 10, 25),
        Vec.of(0, 0, 0),
        Vec.of(0, 1, 0)
    );
    this.initial_camera_location = Mat4.inverse(
        context.globals.graphics_state.camera_transform
    );

    this.initial_avatar_location = Mat4.identity().times(
        Mat4.translation([0, 0, 10])
    );
    this.avatar_pos = this.initial_avatar_location;

    const r = context.width / context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective(
        Math.PI / 4,
        r,
        0.1,
        1000
    );

    const shapes = {
      // TODO:  Added in as many shapes as we need for this project
      torus: new Torus(15, 15),
      torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),
      sphere: new Subdivision_Sphere(4),
      box_3: new Cube(),
      box_4: new Cube(),
      box: new Cube(),
      box_1: new Cube(),
      box_2: new Cube(),
      box_5: new Cube(),
      spike: new SpikeBall(15, 15, [2, 2]),
      square: new Square(),
      frame: new Cube_Outline(),
      balloon: new Balloon(20,20,[1,1]),
      string: new String(20,20,[1,1]),
      circle: new Circle(20,20),
      cone: new Hat(20,20,[1,1]),
      head: new Face(4),
      body: new Body(20,20,[1,1]),
      leg: new Legs(20,20,[1,1]),
      arm_s: new Arm_still(20,20,[1,1]),
      arm: new Arm(20,20,[1,1]),
      hair: new Hair(4),
      mouse: new Mouse(20,20,[2,2]),
      mouse_parts: new Mouse_parts(20,20,[2,2]),
      mouse_eyes: new Mouse_eyes(20,20,[2,2]),
      mouse_tail: new Mouse_tail(20,20,[2,2]),
    };
    shapes.box_3.texture_coords = shapes.box_3.texture_coords.map(v => Vec.of(v[0] * 2, v[1] * 2));
    shapes.box_2.texture_coords = shapes.box_2.texture_coords.map(v => Vec.of(v[0] * 2, v[1] * 6));
    shapes.box_1.texture_coords = shapes.box_1.texture_coords.map(v => Vec.of(v[0] * 4, v[1] * 6));
    shapes.box_4.texture_coords = shapes.box_4.texture_coords.map(v => Vec.of(v[0] * 20, v[1] * 4));
    shapes.box_5.texture_coords = shapes.box_5.texture_coords.map(v => Vec.of(v[0] * 20, v[1] * 20));
    this.submit_shapes(context, shapes);

    // Make some Material objects available to you:
    this.materials = {
      avatar: context
          .get_instance(Phong_Shader)
          .material(Color.of(.789, .605, .96, 1), { ambient: 0.1 }),
      mouse: context
          .get_instance(Phong_Shader)
          .material(Color.of(0.824, .824, .824, 1), { ambient: 0.1 }),
      mouse_parts: context
          .get_instance(Phong_Shader)
          .material(Color.of(.9531, .758, .758, 1), { ambient: 0.1 }),
      mouse_eyes: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), { ambient: 0.1 }),
      wall: context
          .get_instance(Phong_Shader)
          .material(Color.of(0.8, 0.9, 1, 1), { ambient: 0.8}),
      funhouse_wall: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 0.8,
            texture:context.get_instance("assets/funhouse.jpg",true)
          }),
      face: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture:context.get_instance("assets/face.jpg",true)
          }),
      pictures: context
          .get_instance(Phong_Shader)
              .material(Color.of(0, 0, 0, 1), {
                ambient: .7,
                texture: context.get_instance("assets/picture_frame.jpg",true)
              }),
      pictures1: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture: context.get_instance("assets/ferris_wheel.jpg",true)
          }),
      pictures2: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture: context.get_instance("assets/funhouse.jpg",true)
          }),
      pictures3: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: .6,
            texture: context.get_instance("assets/elephant.jpg",true)
          }),
      pictures4: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: .6,
            texture: context.get_instance("assets/clown.png",true)
          }),
      pictures5: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture: context.get_instance("assets/merry.jpg",true)
          }),

      cart: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: .6,
            texture: context.get_instance("assets/cart.png",true)
          }),
      hair: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: .5,
          }),
      legs: context
          .get_instance(Phong_Shader)
          .material(Color.of(.941, .757, .445, 1), {
            ambient: .5,
          }),
      wall2: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {//(Color.of(0.8, 0.9, 1, 1)
            ambient: .6,
            texture:context.get_instance("assets/wall.jpg",true)
          }),
      popcorn: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {//(Color.of(0.8, 0.9, 1, 1)
            ambient: 1,
            diffusivity: 0,
            specularity: 0,
            texture:context.get_instance("assets/popcorn.png",true)
          }),
      balloon: context
          .get_instance(Phong_Shader)
          .material(Color.of(1, 0, 0, .7), {
            ambient: 0.8
          }),
      string: context
          .get_instance(Phong_Shader)
          .material(Color.of(1, 1, 1, 1), {
            ambient: 0.8
          }),
      mirror: context
          .get_instance(Phong_Shader)
          .material(Color.of(0.95, 1, 0.95, 1), { ambient: 0.1, diffusivity: 0 }),
      frame: context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: .7, texture: context.get_instance("assets/blue_wood.jpg",true)}),
      floor: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
        ambient: .75,
        texture: context.get_instance("assets/wood_floor.jpg", true)
      }),
      shadow: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, .8), {
        ambient: 1,
        diffusivity: 0,
        specularity: 0,
      })
    };
    this.prev = 0;
    this.mouse_pos = Mat4.identity();
    this.tail_pos = Mat4.identity();
    this.lights = [
      new Light(Vec.of(0, 0, 5, 1), Color.of(1, 1, 1, 1), 100),
      new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 10000),
      new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 10000),
      new Light(Vec.of(-20, 10, 20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(-20, 10, -20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(20, 10, 20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(20, 10, -20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(0, 10, 20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(0, 10, -20, 1), Color.of(1, 1, 1, 1), 1000)
    ];

    this.move_l_pressed = this.move_r_pressed = this.move_u_pressed = this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
  }
  set_pos(dir) {
    if (dir === 1)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([-0.5, 0, 0]));
    else if (dir === 2)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0.5, 0]));
    else if (dir === 3) {
      if (this.avatar_pos[1][3] > 0)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, -0.5, 0]));
    } else if (dir === 4) {
      if (this.avatar_pos[2][3] > 1.5)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, -0.5]));
    } else if (dir === 5){
      if (this.avatar_pos[2][3] < 29.0)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, 0.5]));
      }
    else this.avatar_pos = this.avatar_pos.times(Mat4.translation([0.5, 0, 0]));

    this.move_l_pressed = this.move_r_pressed = this.move_u_pressed = this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
  }

  make_control_panel() {
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

    this.key_triggered_button("Left", ["a"], () => {
      this.move_l_pressed = true;
    },
    "#F60E26"
    );
    this.key_triggered_button("Right", ["d"], () => {
      this.move_r_pressed = true;
    },
    "#F2337B"
    );
   // this.new_line();
    this.key_triggered_button("Up", ["w"], () => {
      this.move_u_pressed = true;
    },
    "#F6D003"
    );
    this.key_triggered_button("Down", ["s"], () => {
      this.move_d_pressed = true;
    },
    "#077DDF"
    );
   // this.new_line();
    this.key_triggered_button("Forward", ["f"], () => {
      this.move_f_pressed = true;
    },
    "#173885"
    );
    this.key_triggered_button("Back", ["b"], () => {
      this.move_b_pressed = true;
    },
    "#872E8C"
    );
    this.new_line();
    this.new_line();
    this.new_line();
    this.key_triggered_button(
        "View whole",
        [" "],
        () => (this.attached = () => this.initial_camera_location),
        "#D72630"
    );
    //this.new_line();
    this.key_triggered_button(
        "mirror 1",
        ["z"],
        () => (this.attached = () => this.mirror_1),
        "#D7D52A"
    );
    this.key_triggered_button(
        "mirror 2",
        ["x"],
        () => (this.attached = () => this.mirror_2),
        "#F28A17"
    );
   // this.new_line();
    this.key_triggered_button(
        "mirror 3",
        ["c"],
        () => (this.attached = () => this.mirror_3),
        "#07A499"
    );
    this.key_triggered_button(
        "avatar",
        ["v"],
        () => (this.attached = () => this.avatar_pos),
        "#FF7EA0"
    );
   // this.new_line();
  }

  setupScene(graphics_state) {
    let identity = Mat4.identity();
    this.mirror_1 = Mat4.identity();
    this.mirror_2 = Mat4.identity().times(Mat4.translation([-12, 0, 0]));
    this.mirror_3 = Mat4.identity().times(Mat4.translation([12, 0, 0]));

    this.shapes.box_3.draw( //floor
        graphics_state,
        identity
            .times(Mat4.translation([0, -5, 0]))
            .times(Mat4.scale([30, 2.5, 30])),
        this.materials.floor
    );
    this.shapes.box_2.draw( //middle left
        graphics_state,
        identity
            .times(Mat4.translation([-6, 0, 0]))
            .times(Mat4.scale([2.5, 10, .05])),
        this.materials.funhouse_wall
    );
    /*frame left*/
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-8.5, 4, 0]))
            .times(Mat4.scale([.2, 6, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-15, 4, 0]))
            .times(Mat4.scale([.2, 6, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-11.75, 10, 0]))
            .times(Mat4.scale([3.45, .2, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-11.75, -2, 0]))
            .times(Mat4.scale([3.45, .2, .1])),
        this.materials.frame
    )
    /****/
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-6, 5, 0]))
            .times(Mat4.scale([1.75, 1.43, .1])),
        this.materials.pictures
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-6, 5, 0]))
            .times(Mat4.scale([1.5, 1.25, .11])),
        this.materials.pictures1
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([6, 5, 0]))
            .times(Mat4.scale([1.75, 1.43, .1])),
        this.materials.pictures
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-12, 0, 10]))
            .times(Mat4.scale([1.25, 1, .01])),
        this.materials.popcorn
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-13, 0, -7]))
            .times(Mat4.scale([.5, .5, .01])),
        this.materials.popcorn
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([6, 5, 0]))
            .times(Mat4.scale([1.5, 1.25, .11])),
        this.materials.pictures5
    )
    this.shapes.box_2.draw( //middle right
        graphics_state,
        identity
            .times(Mat4.translation([6, 0, 0]))
            .times(Mat4.scale([2.5, 10, .05])),
        this.materials.funhouse_wall
    );
    /*frame right*/
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([8.5, 4, 0]))
            .times(Mat4.scale([.2, 6, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([15, 4, 0]))
            .times(Mat4.scale([.2, 6, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([11.75, 10, 0]))
            .times(Mat4.scale([3.45, .2, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([11.75, -2, 0]))
            .times(Mat4.scale([3.45, .2, .1])),
        this.materials.frame
    )
    /****/
    /*frame middle*/
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([3.25, 4, 0]))
            .times(Mat4.scale([.2, 6, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-3.25, 4, 0]))
            .times(Mat4.scale([.2, 6, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([0, 10, 0]))
            .times(Mat4.scale([3.45, .2, .1])),
        this.materials.frame
    )
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([0, -2, 0]))
            .times(Mat4.scale([3.45, .2, .1])),
        this.materials.frame
    )
    /****/
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([-25, 3.5, -29.9]))
            .times(Mat4.scale([1.2, 5/3+.2, .05])),
        this.materials.pictures
    )
    let cart_pos = identity
        .times(Mat4.translation([-25, 3.5, -29.8]))
        .times(Mat4.scale([1, 5/3, .05]));
    this.shapes.box.draw( //middle right
        graphics_state,
        cart_pos,
        this.materials.cart
    );
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([25, 3.5, -29.9]))
            .times(Mat4.scale([1.7, 7.5/3+.2, .05])),
        this.materials.pictures
    )
    let ele = identity
        .times(Mat4.translation([25, 3.5, -29.8]))
        .times(Mat4.scale([1.5, 7.5/3, .05]));
    this.shapes.box.draw( //middle right
        graphics_state,
        ele,
        this.materials.pictures3
    );
    this.shapes.box.draw(
        graphics_state,
        identity
            .times(Mat4.translation([0, 3.5, -29.9]))
            .times(Mat4.scale([2.2, 10/3+.2, .05])),
        this.materials.pictures
    )
    let clown = identity
        .times(Mat4.translation([0, 3.5, -29.8]))
        .times(Mat4.scale([2, 10/3, .05]));
    this.shapes.box.draw( //middle right
        graphics_state,
        clown,
        this.materials.pictures4
    );

    this.shapes.box_1.draw( //left side
        graphics_state,
        identity
            .times(Mat4.translation([-22.5, 0, 0]))
            .times(Mat4.scale([7.5, 10, .05])),
        this.materials.funhouse_wall
    );
    this.shapes.box_1.draw( //right side
        graphics_state,
        identity
            .times(Mat4.translation([22.5, 0, 0]))
            .times(Mat4.scale([7.5, 10, .05])),
        this.materials.funhouse_wall
    );
    this.shapes.box_4.draw( //top
        graphics_state,
        identity
            .times(Mat4.translation([0, 20, 0]))
            .times(Mat4.scale([30, 10, .01])),
        this.materials.funhouse_wall
    );
    this.shapes.box_2.draw( //bottom
        graphics_state,
        identity
            .times(Mat4.translation([0,-2.5,0]))
            .times(Mat4.scale([30,.5,.1])),
        this.materials.funhouse_wall
    )
    this.shapes.box_2.draw( //bottom
        graphics_state,
        identity
            .times(Mat4.translation([-30,-2.5,0]))
            .times(Mat4.scale([.1,.5,30])),
        this.materials.funhouse_wall
    )
    this.shapes.box_2.draw( //bottom
        graphics_state,
        identity
            .times(Mat4.translation([30,-2.5,0]))
            .times(Mat4.scale([.1,.5,30])),
        this.materials.funhouse_wall
    )
    this.shapes.box_2.draw( //bottom
        graphics_state,
        identity
            .times(Mat4.translation([0,-2.5,30]))
            .times(Mat4.scale([30,.5,.1])),
        this.materials.funhouse_wall
    )
    this.shapes.box_2.draw( //bottom
        graphics_state,
        identity
            .times(Mat4.translation([0,-2.5,-30]))
            .times(Mat4.scale([30,.5,.1])),
        this.materials.funhouse_wall
    )
    this.shapes.box.draw( //outside boxwall
        graphics_state,
        identity
            .times(Mat4.translation([0,-5,0]))
            .times(Mat4.scale([30,30,30])),
        this.materials.wall2
    )
  }
  movement() {
    // movement of avatar
    if (this.move_r_pressed) this.set_pos(0);
    else if (this.move_l_pressed) this.set_pos(1);
    else if (this.move_u_pressed) this.set_pos(2);
    else if (this.move_d_pressed) this.set_pos(3);
    else if (this.move_f_pressed) this.set_pos(4);
    else if (this.move_b_pressed) this.set_pos(5);
  }
  mirror_eq(focus, obj_dist) {
    return (obj_dist * focus) / (obj_dist - focus);
  }
  draw_balloon(graphics_state, pos){
    this.shapes.string.draw(graphics_state,pos,this.materials.string);
    this.shapes.balloon.draw(graphics_state, pos,this.materials.balloon);

  }
  draw_balloon_help(graphics_state,pos,t){
    this.draw_balloon(graphics_state, [[pos[0][0], pos[0][1], pos[0][2], pos[0][3]+0.125*Math.sin(t)], [pos[1][0], pos[1][1], pos[1][2], (pos[1][3] + 0.25 * Math.sin(t))], pos[2], pos[3]]);
  }
  draw_arm_help(graphics_state,pos,t)
  {
    let pos_1 = new Mat(pos[0], pos[1], pos[2], pos[3]);
    pos_1 = pos_1.times(Mat4.rotation(-0.125*Math.sin(t), [0,0,1]));
    this.shapes.arm.draw(graphics_state, pos_1 ,this.materials.legs);
  }
  draw_shadow_help(graphics_state,pos,passed)
  {
    let scale = 1+ (pos[1][3]*0.05);
    let ambient_scale = (1/(scale*2));
    let scale_2 = 1+((Math.abs(pos[2][3])-5)*0.1);
    if(passed == 1) {
      this.shapes.circle.draw(graphics_state,
          [[pos[0][0] * scale * passed, pos[0][1], pos[0][2], pos[0][3]],
            [pos[1][0], pos[1][1] * passed, pos[1][2], 0],
            [pos[2][0], pos[2][1], pos[2][2] * scale * scale_2 * passed, pos[2][3]], pos[3]], this.materials.shadow.override({ambient: ambient_scale}));
    }
    else
      this.shapes.circle.draw(graphics_state,
          [[pos[0][0] * scale * passed, pos[0][1], pos[0][2], pos[0][3]],
            [pos[1][0], pos[1][1] * passed, pos[1][2], -1],
            [pos[2][0], pos[2][1], pos[2][2] * scale * scale_2 * passed, pos[2][3]], pos[3]], this.materials.shadow.override({ambient: ambient_scale}));
  }
  draw_avatar_help(graphics_state,pos,t) {
    //this.shapes.cone.draw(graphics_state, pos, this.materials.floor)
    this.shapes.head.draw(graphics_state, pos, this.materials.face)
    this.shapes.body.draw(graphics_state, pos, this.materials.avatar)
    this.shapes.leg.draw(graphics_state, pos, this.materials.legs)
    this.shapes.arm_s.draw(graphics_state, pos, this.materials.legs)
    this.shapes.hair.draw(graphics_state, pos, this.materials.hair)
    this.draw_arm_help(graphics_state,pos,t);
  }
  draw_mouse_help(graphics_state,t){
    let xpos = 18*Math.sin(t*0.4);
    let zpos = .25*Math.sin(t*5);
    let model_transform = Mat4.identity().times(Mat4.translation([xpos, -1.9, 2+zpos]));
    if (this.prev-xpos < 0)
      model_transform = model_transform.times(Mat4.rotation(Math.PI,[0,1,0]));
    this.shapes.mouse.draw(graphics_state,model_transform, this.materials.mouse);
    this.shapes.mouse_parts.draw(graphics_state,model_transform, this.materials.mouse_parts);
    this.shapes.mouse_eyes.draw(graphics_state,model_transform, this.materials.mouse_eyes);
    this.tail_pos = model_transform.times(Mat4.rotation(Math.PI/8*Math.sin(t*4),[0,1,0]));
    this.shapes.mouse_tail.draw(graphics_state,this.tail_pos,this.materials.mouse_parts);
    this.prev = xpos;
    this.mouse_pos = model_transform;
  }
  draw_mouse_image_help(graphics_state,pos)
  {
    this.shapes.mouse.draw(graphics_state,pos, this.materials.mouse);
    this.shapes.mouse_parts.draw(graphics_state,pos, this.materials.mouse_parts);
    this.shapes.mouse_eyes.draw(graphics_state,pos, this.materials.mouse_eyes);
  }
  draw_mouse_shadow_help(graphics_state,pos,passed,num)
  {
    //let scale = 1+ (pos[1][3]*0.05);
    let scale_2 = 1+((Math.abs(pos[2][3])-5)*0.1);
    this.shapes.circle.draw(graphics_state,
        [[pos[0][0]  * passed, pos[0][1], pos[0][2], pos[0][3]],
        [pos[1][0], pos[1][1] * passed, pos[1][2], num],
        [pos[2][0], pos[2][1], pos[2][2]  * scale_2 * passed, pos[2][3]], pos[3]], this.materials.shadow);
  }
  display(graphics_state) {
    graphics_state.lights = this.lights; // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000,
        dt = graphics_state.animation_delta_time / 1000;
    this.setupScene(graphics_state);
    this.movement();

    //draw avatar
    if(this.avatar_pos[1][3]>0)
      this.avatar_pos[1][3] -= dt;

    this.draw_avatar_help(graphics_state, this.avatar_pos,t );
    this.draw_mouse_help(graphics_state, t);
    this.draw_mouse_shadow_help(graphics_state,Mat4.translation([0,1.9,0]).times(this.mouse_pos),.5,-1.2)


    //this.shapes.avatar.draw(this.mycontext, graphics_state, this.avatar_pos,this.materials.avatar);
    this.draw_shadow_help(graphics_state, this.avatar_pos,1);
    this.draw_balloon_help(graphics_state,this.avatar_pos,t);



    //draw reflected cases
    //plane mirror
    let copy = this.avatar_pos;
    let scale = 1;
    let reflected_mat = [
      copy[0],
      copy[1],
      [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
      copy[3]
    ];
    if (this.avatar_pos[0][3] >= -8 && this.avatar_pos[0][3] <= 8) {
      this.draw_avatar_help(graphics_state,reflected_mat,t);
      this.draw_balloon_help(graphics_state,reflected_mat,t);
      this.draw_shadow_help(graphics_state,reflected_mat,1);
    }
    //convex case will always be upright
    else if (this.avatar_pos[0][3] < -8) {
      scale =
          (-1 * this.mirror_eq(-3, this.avatar_pos[2][3])) /
          this.avatar_pos[2][3];
      copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];

      this.draw_avatar_help(graphics_state,reflected_mat,t);
      this.draw_balloon_help(graphics_state,reflected_mat,t);
      this.draw_shadow_help(graphics_state,reflected_mat,1);
    }
    //concave cases
    else if (this.avatar_pos[0][3] > 8) {
      //if needs to be inverted
      if (this.mirror_eq(4.0, this.avatar_pos[2][3]) > 0) {
        scale =
            this.mirror_eq(4.0, this.avatar_pos[2][3]) / this.avatar_pos[2][3];
        if(scale > 3) scale = 3;
        console.log(scale);
        copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
        //copy = copy.times(Mat4.rotation(Math.PI,[0,1,0])).times(Mat4.rotation(Math.PI,[0,1,0]))
        reflected_mat = [
          copy[0],
          [1 * copy[1][0], -1 * copy[1][1], -1 * copy[1][2], -1 * copy[1][3]],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
        if(this.avatar_pos[2][3] < 3) {
          reflected_mat[2][3] = -10;
          console.log(reflected_mat[2][3]);
        }
      } else {
        scale =
            (-1 * this.mirror_eq(4.0, this.avatar_pos[2][3])) /
            this.avatar_pos[2][3];
        if(scale > 3) scale = 3;
        copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
        reflected_mat = [
          copy[0],
          copy[1],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
        this.draw_shadow_help(graphics_state,reflected_mat,1);
      }
      this.draw_balloon_help(graphics_state,reflected_mat,t);
      this.draw_avatar_help(graphics_state,reflected_mat,t);
    }

    /**mouse**/
    if(this.mouse_pos[0][3] >= -8 && this.mouse_pos[0][3] <= 8) {
      copy = this.mouse_pos;
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.draw_mouse_image_help(graphics_state, reflected_mat);
      copy = this.tail_pos;
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.shapes.mouse_tail.draw(graphics_state,reflected_mat,this.materials.mouse_parts);
      copy = Mat4.translation([0,1.9,0]).times(this.mouse_pos).times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.draw_mouse_shadow_help(graphics_state,reflected_mat,.5,-1.2)
    }
    //convex case will always be upright
    else if (this.mouse_pos[0][3] < -8) {
      scale =
          (-1 * this.mirror_eq(-3, this.mouse_pos[2][3])) /
          this.mouse_pos[2][3];
      copy = this.mouse_pos.times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.draw_mouse_image_help(graphics_state,reflected_mat);
      copy = this.tail_pos.times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.shapes.mouse_tail.draw(graphics_state,reflected_mat,this.materials.mouse_parts);
      copy = Mat4.translation([0,1.9,0]).times(this.mouse_pos).times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.draw_mouse_shadow_help(graphics_state,reflected_mat,.5,-1.5)
    }
    //concave
    else if (this.mouse_pos[0][3] > 8) {
      //if needs to be inverted
      if (this.mirror_eq(4.0, this.mouse_pos[2][3]) > 0) {
        scale =
            this.mirror_eq(4.0, this.mouse_pos[2][3]) / this.mouse_pos[2][3];
        if(scale > 3) scale = 3;
        console.log(scale);
        copy = this.mouse_pos.times(Mat4.scale([scale, scale, scale]));
        //copy = copy.times(Mat4.rotation(Math.PI,[0,1,0])).times(Mat4.rotation(Math.PI,[0,1,0]))
        reflected_mat = [
          copy[0],
          [1 * copy[1][0], -1 * copy[1][1], -1 * copy[1][2], -1 * copy[1][3]],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
        if(this.mouse_pos[2][3] < 3) {
          reflected_mat[2][3] = -10;
          console.log(reflected_mat[2][3]);
        }
      } else {
        scale =
            (-1 * this.mirror_eq(4.0, this.mouse_pos[2][3])) /
            this.mouse_pos[2][3];
        if(scale > 3) scale = 3;
        copy = this.mouse_pos.times(Mat4.scale([scale, scale, scale]));
        reflected_mat = [
          copy[0],
          copy[1],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
      }
      this.draw_mouse_image_help(graphics_state,reflected_mat);
      copy = this.tail_pos.times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.shapes.mouse_tail.draw(graphics_state,reflected_mat,this.materials.mouse_parts);
      copy = Mat4.translation([0,1.9,0]).times(this.mouse_pos).times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      //this.draw_mouse_shadow_help(graphics_state,reflected_mat,.5,-.5)
    }

    //camera coordinates
    let translate_back = Mat4.translation(Vec.of(0, 2, 8));
    if (typeof this.attached !== "undefined") {
      switch (this.attached()) {
        case this.initial_camera_location:
          graphics_state.camera_transform = Mat4.look_at(
              Vec.of(0, 10, 25),
              Vec.of(0, 0, 0),
              Vec.of(0, 1, 0)
          ).map((x, i) =>
              Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
        case this.mirror_1:
        case this.mirror_2:
        case this.mirror_3:
          graphics_state.camera_transform = Mat4.inverse(
              this.attached().times(translate_back)
          ).map((x, i) =>
              Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
        case this.avatar:
          graphics_state.camera_transform = Mat4.inverse(
              this.avatar_pos.times(translate_back)
          ).map((x, i) =>
              Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
      }
    }
  }
};


/**** SECOND SCENE *****/
window.Main_Scene = window.classes.Main_Scene = class Main_Scene extends Scene_Component {
  constructor(context, control_box) {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box);
    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(
          new Movement_Controls(context, control_box.parentElement.insertCell())
      );

    context.globals.graphics_state.camera_transform = Mat4.look_at(
        Vec.of(0, 5, 35),
        Vec.of(0, 0, 0),
        Vec.of(0, 1, 0)
    );
    this.initial_camera_location = Mat4.inverse(
        context.globals.graphics_state.camera_transform
    );

    const r = context.width / context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective(
        Math.PI / 4,
        r,
        0.1,
        1000
    );

    const shapes = {
      // TODO:  Added in as many shapes as we need for this project
      cone: new Closed_Cone(20,20,[1,2]),
      cylinder_mod: new Cylindrical_Tube_2(20,20,[1,1]),
      balloon: new Balloon(20,20,[1,1]),
      tent: new Tent(20,20,[5,5]),
      cylinder: new Cylinder(20,20,[5,5]),
      //sphere: new Subdivision_Sphere_small(4),
      sphere: new Circle_small(4,4),
      sphere_2: new Subdivision_Sphere(4),
      cube: new Cube(),
      cube_2: new Cube(),
      square: new Square(),
    };
    shapes.cube.texture_coords = shapes.cube.texture_coords.map(v => Vec.of(v[0] * 3, v[1] * 3));
    shapes.cube_2.texture_coords = shapes.cube_2.texture_coords.map(v => Vec.of(v[0] * 6, v[1] * 6));
    this.submit_shapes(context, shapes);

    // Make some Material objects available to you:
    this.materials = {
      firework: context
          .get_instance(Phong_Shader)
          .material(Color.of(1, 0, 0, 1), {
            ambient: 1
          }),
      world: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture: context.get_instance("assets/stars.png")
          }),
      tent: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture: context.get_instance("assets/tent.png"),
            specularity: 0,
            diffusivity: 0,
          }),
      ground: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: .15,
            texture: context.get_instance("assets/grass.jpg")
          }),
      sign: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 0.8,
            texture: context.get_instance("assets/words.jpg"),
            specularity: 0,
            diffusivity: 0
          }),
      sign2: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            texture: context.get_instance("assets/words2.jpg"),
            specularity:0,
            diffusivity:0
          }),
    };

    this.lights = [new Light([0,20,20], Color.of(1,1,1,1), 100000)];
    this.fire = [false,false,true,false,false,false,true,false,false,false];
    this.counts = 0;
    this.rec = 0;
    this.pos = [Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity(),Mat4.identity()]
    this.colors = [Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
      Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
      Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
      Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
      Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1)];


  }

  make_control_panel() {
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.


  }
  determine_trans(pos,num1,num2)
  {
    return Mat4.translation([num1,num2,0]).times(pos);
  }
  draw_fireworks(graphics_state, pos, rec,i)
  {
    if(rec == 0)
      return
    this.shapes.sphere.draw(graphics_state, pos, this.materials.firework.override({color:this.colors[i]}))
    let position = this.determine_trans(pos,0.75,0);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,0.375,0.649519);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,-0.375,0.649519);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,-0.75,0);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,-0.375,-0.649519);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,0.375,-0.649519);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,0.649519,0.375);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,.75,0);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,-0.649519,0.375);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,-.75,0);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
    position = this.determine_trans(pos,-0.649519,-0.375);
    this.shapes.sphere.draw(graphics_state, position, this.materials.firework.override({color:this.colors[i]}))
    this.draw_fireworks(graphics_state,position,rec-1,i)
  }
  set_pos(i,mult1,mult2)
  {
    this.pos[i][1] = [this.pos[i][1][0],this.pos[i][1][1],this.pos[i][1][2],this.pos[i][1][3]+(mult1*Math.random()*5)+3];
    this.pos[i][2] = [this.pos[i][2][0],this.pos[i][2][1],this.pos[i][2][2],this.pos[i][2][3]+(mult2*Math.random()*5)+15];
  }
  display(graphics_state) {
    graphics_state.lights = this.lights; // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000,
        dt = graphics_state.animation_delta_time / 1000;
    let identity = Mat4.identity();
    let model_transform = identity;
    this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([0,-25,-45])).times(Mat4.scale([20,15,5])),this.materials.tent);
    this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([40,-25,-50])).times(Mat4.scale([20,20,10])),this.materials.sign2);
    this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([-40,-25,-50])).times(Mat4.scale([20,20,10])),this.materials.sign);
    //this.shapes.cylinder.draw(graphics_state,identity.times(Mat4.translation([10,0,0])),this.materials.tent);
    if (this.counts == 103) {
      for (let i = 0; i < 10; i++) {
         //if (Math.floor(Math.random() * 3) == 1)
         //this.fire[i] = true;
        //else
        this.fire[i] = false;

      }
      this.fire[Math.floor(Math.random() * 10)] = true;
      this.fire[Math.floor(Math.random() * 10)] = true;
      this.fire[Math.floor(Math.random() * 10)] = true;
      this.fire[Math.floor(Math.random() * 10)] = true;
      this.fire[Math.floor(Math.random() * 10)] = true;
      this.counts = 0;
      this.rec = 0;
      /*this.colors = [Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
        Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
        Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
        Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1),
        Color.of(Math.random(), Math.random(), Math.random(),1), Color.of(Math.random(), Math.random(), Math.random(),1)];
    }*/
    }
    if (this.counts >= 100) {
      this.rec++;
    }
    this.lights = [];
    for (let i = 0; i < 10; i++) {
      model_transform = identity.times(Mat4.translation([i * 4 - 20, this.counts * .02, 0]))
      if (this.counts < 100) {
        if (this.fire[i]) {
          this.shapes.cylinder.draw(graphics_state, model_transform, this.materials.firework)
          this.lights.push(new Light(Vec.of(model_transform[0][3], model_transform[1][3], model_transform[2][3], 1), Color.of(1, 1, 1, 1), 1000))
        }
      } else if (this.counts == 100) {
        this.pos[i] = model_transform;
        if(Math.floor(Math.random()*2))
        {
          if(Math.floor(Math.random()*2))
            this.set_pos(i,1,1)
          else
            this.set_pos(i,-1,1)
        }
        else{
          if(Math.floor(Math.random()*2))
            this.set_pos(i,1,-1)
          else
            this.set_pos(i,-1,-1)
        }
      }
      else{
        if (this.fire[i]) {
         // this.lights.push(new Light(Vec.of(this.pos[i][0][3], this.pos[i][1][3], this.pos[i][2][3], 1), Color.of(1, 1, 1, 1), 1000000))
           this.draw_fireworks(graphics_state, this.pos[i], this.rec,i)
        }
      }
    }
    this.counts++;
    this.shapes.cube.draw(graphics_state, Mat4.identity().times(Mat4.scale([60,60,60])), this.materials.world);
    this.shapes.cube_2.draw(graphics_state, Mat4.identity().times(Mat4.translation([0,-50,0])).times(Mat4.scale([60,10,60])), this.materials.ground);
  }

};


/***** THIRD SCENE *********/
window.Dart_Scene= window.classes.Dart_Scene =
    class Dart_Scene extends Scene_Component {
        constructor(context, control_box)
        {
            // The scene begins by requesting the camera, shapes, and materials it will need.
            super(context, control_box);
            // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 100), Vec.of(0, 0, 0), Vec.of(0, 1, 0));

            this.initial_camera_location = Mat4.identity()
                .times(Mat4.translation([-130,5,-10]))
                .times(Mat4.rotation(Math.PI/-2, [0,1,0]));

            context.globals.graphics_state.camera_transform = Mat4.inverse(this.initial_camera_location);

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                bar: new Cube(),
                cylinder: new Rounded_Capped_Cylinder(20,20,[2,2]),
                cone : new Closed_Cone(20, 20, [2,2]),
                flag: new Flag2(201),
                wing: new Windmill(4),
                wood: new Cube(),
                background_wall: new Cube(),
                beer: new Cylindrical_Tube(20, 20, [20,20]),
                triangle: new Triangle(),
                ground: new Cube(),
                sphere: new Subdivision_Sphere(4),
            };

            shapes.background_wall.texture_coords = shapes.background_wall.texture_coords.map(v => Vec.of(v[0] * 6, v[1] * 6));
            shapes.ground.texture_coords = shapes.ground.texture_coords.map(v => Vec.of(v[0] * 40, v[1] * 20));

            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            this.materials =
                {
                    bar : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1}),
                    dart : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 0.5, specularity: 1}),
                    cone : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
                    wing : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
                    board: context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/dart_board.png", true)}),
                    beer : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/heineken.png", true)}),
                    flag: context.get_instance(Flag_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/flag.png", true)}),
                    fire : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1, specularity: 1}),
                    blue_fire : context.get_instance(Phong_Shader).material(Color.of(44/255,83/255,143/255,1), {ambient: 1, diffusivity: 1,}),
                    yellow_fire : context.get_instance(Phong_Shader).material(Color.of(1,189/255,46/255,1), {ambient: 1, diffusivity: 1,}),
                    table_wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/table_wood.jpg", true)}),
                    wood_tile : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/high_res_wood_tile.jpg", true)}),
                    wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/wood.png", true)}),
                    white_wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/table_wood.jpg", true)}),
                    brick : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/brick.jpg", true)}),
                    marvel : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/fun.jpg", true)}),
                    silk : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/silk_fabric.jpg", true)}),
                    toystory : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/behind_dart.jpg", true)}),
                    photo_frame : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1}),
                    funhouse : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/funhouse.jpg", true)}),
                    carnival_tent : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/carnival_tent.png", true)}),
                };

            this.lights = [new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
                           new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)];

            // physics variables
            this.max_power = 150;
            this.power = 0;
            this.power_x = 0;
            this.power_y = 0;
            this.power_z = 0;

            this.accel_x = 0.0;
            this.accel_y = -9.8; // gravity
            this.accel_z = 5.0;

            // 0 ~ 90 (up down), -90 ~ 90 (left right)
            this.up_down_angle = 0;
            this.left_right_angle = 0;

            // conditional variables
            this.charging = false;
            this.shoot = false;
            this.collision_computed = false;
            this.angle_up_start = false;
            this.angle_down_start = false;
            this.angle_left_start = false;
            this.angle_right_start = false;
            this.bulls_eye = false;
            this.stop_firework = true;
            this.fire_time = 0;

            //random firework
            this.random_v = [];
            this.random_g = [];
            this.random_color = [];
            this.random_x_angle = [];
            this.random_z_angle = [];
            this.random_direct = [];

            this.get_random();

            // time
            this.charging_start_time = 0;
            this.curr_time = 0;

            // transform: dart, board, power bar
            this.default_dart_pos = [-100 ,0, 0]; // default (based on the rightmost piece)
            this.dart_pos = [-100 ,0, 0]; // current dart posi1tion
            this.board_pos = [100,0,0]; // default
            this.bar_transform = Mat4.identity().times(Mat4.translation([10,0,0]));

            this.front_view = Mat4.identity()
                .times(Mat4.translation([-120,0,0]))
                .times(Mat4.rotation(-1*Math.PI/2, Vec.of(0,1,0)));

            this.score = 0;
            this.max_socre = 0;
            this.display_bulls_eye_sign = 0;
            this.level = 1;
        }

        make_control_panel() {
            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
            this.key_triggered_button("Charge", ["Enter"], this.start_charging,"#173885", this.start_shoot);
            this.key_triggered_button("Angle Up", ["i"], this.angle_up, "#F2337B", this.angle_up_release);
            this.key_triggered_button("Angle Down", ["k"], this.angle_down,"#F6D003", this.angle_down_release);
            this.key_triggered_button("Angle Left", ["j"], this.angle_left,"#077DDF", this.angle_left_release);
            this.key_triggered_button("Angle Right", ["l"], this.angle_right,"#F60E26", this.angle_right_release);
            this.new_line();
            this.key_triggered_button("Restart", ["q"], this.restart,"#872E8C");
            this.key_triggered_button("Front View", ["1"], ()=>this.attached=()=> this.front_view, "#D72630");
            this.key_triggered_button("Side View", ["2"],  ()=>this.attached=()=> this.initial_camera_location, "#D7D52A");
            this.key_triggered_button("Dart View", ["/"],  ()=>this.attached=()=> this.dart_view, "#F28A17");
            this.key_triggered_button("Change Wind Direction", ["3"],  ()=>this.accel_z=this.accel_z*-1,  "#07A499");
            this.key_triggered_button("More Wind", ["9"],  ()=>this.accel_z+= 1,  "#FF7EA0");
            this.key_triggered_button("Less Wind", ["0"],  ()=>this.accel_z-= 1, "#F60E26");
        }

        start_charging() {
            console.log("Start charging");
            this.charging = true;
            this.shoot = false;
            this.charging_start_time = this.curr_time;
        }

        /* Key Event Handlers */
        start_shoot() {
            console.log("Shoot!");
            console.log(this.power);
            this.charging = false;
            this.shoot = true;
            this.decompose_power_x_y_z(this.power, this.up_down_angle, this.left_right_angle);
        }

        angle_up() {
            if (!this.angle_down_start) {
                this.angle_up_start = true;
            }
        }

        angle_up_release() {
            this.angle_up_start = false;
        }

        angle_down() {
            if (!this.angle_up_start) {
                this.angle_down_start = true;
            }
        }

        angle_down_release() {
            this.angle_down_start = false;
        }

        angle_left() {
            if (!this.angle_right_start) {
                this.angle_left_start = true;
            }
        }

        angle_left_release() {
            this.angle_left_start = false;
        }

        angle_right() {
            if (!this.angle_left_start) {
                this.angle_right_start = true;
            }
        }

        angle_right_release() {
            this.angle_right_start = false;
        }

        set_angle() {
            let one_move = Math.PI / 180;
            if (this.angle_up_start && this.up_down_angle < Math.PI/2) {
                this.up_down_angle += one_move;
            } else if (this.angle_down_start && this.up_down_angle > 0) {
                this.up_down_angle -= one_move;
            }

            if (this.angle_left_start && this.left_right_angle < Math.PI/2) {
                this.left_right_angle += one_move;
            } else if (this.angle_right_start && this.left_right_angle > -1* Math.PI/2) {
                this.left_right_angle -= one_move;
            }
        }

        set_bar_transform() {
            this.bar_transform = Mat4.identity()
                .times(Mat4.scale([1,10*(this.power/this.max_power),1]))
                .times(Mat4.translation([10,0,0]))
        }

        restart() {
            this.power = 0;
            this.left_right_angle = 0;
            this.up_down_angle = 0;

            // conditional variables
            this.charging = false;
            this.shoot = false;
            this.angle_up_start = false;
            this.angle_down_start = false;
            this.angle_left_start = false;
            this.angle_right_start = false;
            this.collision_computed = false;
            this.fire_time = 0;

            // transform: dart, board, power bar
            this.dart_pos = [-100,0,0]; // current dart position
            this.bar_transform = Mat4.identity().times(Mat4.translation([10,0,0]));
        }


        draw_table(graphics_state, x,y,z) {

            let x_offset = 900;
            let y_offset = -30;
            let z_offset = -100;
            let rot_angle = Math.PI / 2;

            // body
            let transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([0, -150, -450]))
                .times(Mat4.scale([300, 10, 100]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            // 4 legs (length: 100)
            // front 2 legs
            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([-150, -220, -400]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([150, -220, -400]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            // back 2 legs
            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([-150, -220, -500]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([150, -220, -500]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);
        }

        draw_photos(graphics_state) {
          let x = 500;
          let y = 200;
          let z = 10;
          let rot_angle = Math.PI/2;

          let transform = Mat4.identity();

          // poster
          transform = Mat4.identity();
          transform = transform.times(Mat4.translation([x-10,80,-200]));
          transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
          transform = transform.times(Mat4.scale([60,80,10]));
          this.shapes.bar.draw(graphics_state, transform, this.materials.funhouse);

          // photo
          transform = Mat4.identity();
          transform = transform.times(Mat4.translation([x-10,100,240]));
          transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
          transform = transform.times(Mat4.scale([50,50,10]));
          this.shapes.bar.draw(graphics_state, transform, this.materials.marvel);

          transform = Mat4.identity();
          transform = transform.times(Mat4.translation([x-10 + 5, 100,240]));
          transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
          transform = transform.times(Mat4.scale([55,55,10]));
          this.shapes.bar.draw(graphics_state, transform, this.materials.photo_frame);

          transform = Mat4.identity();
          transform = transform.times(Mat4.translation([x-10, 100,370]));
          transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
          transform = transform.times(Mat4.scale([50,50,10]));
          this.shapes.bar.draw(graphics_state, transform, this.materials.toystory);

          transform = Mat4.identity();
          transform = transform.times(Mat4.translation([x-10 + 5, 100,370]));
          transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
          transform = transform.times(Mat4.scale([55,55,10]));
          this.shapes.bar.draw(graphics_state, transform, this.materials.photo_frame);
        }

        draw_left_wall(graphics_state,mult) {
            let x = 500*mult;
            let y = 200;
            let z = 10;
            let rot_angle = Math.PI/2;

            let transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,-400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,-200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,0]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            // bottom part
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,-400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,-200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,0]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);


            // draw photos and posters
            this.draw_photos(graphics_state)
        }

        draw_back_wall(graphics_state,mult) {
            let x = 550*mult;
            let y = 200;
            let z = 10;
            let rot_angle = Math.PI/2;

            let transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-400,100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-200,100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([0,100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([200,100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([400,100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            // bottom part
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-400,-100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-200,-100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([0,-100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([200,-100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([400,-100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);
        }

        draw_background(graphics_state) {

            this.draw_table(graphics_state, 1,2,3);
            this.draw_left_wall(graphics_state,1);
            this.draw_back_wall(graphics_state,-1);
            this.draw_left_wall(graphics_state,-1);
            this.draw_back_wall(graphics_state,1);

            // ground
            let transform = Mat4.identity()
                .times(Mat4.translation([0,-300,0] ))
                .times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)))
                .times(Mat4.scale([450,500,1]));
            this.shapes.ground.draw(graphics_state, transform, this.materials.silk);
          transform = Mat4.identity()
              .times(Mat4.translation([0,-300,0] ))
              .times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)))
              .times(Mat4.scale([700,700,0]));
          this.shapes.ground.draw(graphics_state, transform, this.materials.wood);

            //ceiling
           transform = Mat4.identity()
               .times(Mat4.translation([0,300,0]))
               .times(Mat4.rotation(Math.PI/2,Vec.of(1,0,0)))
               .times(Mat4.scale([450,500,1]));
           this.shapes.ground.draw(graphics_state,transform,this.materials.brick);
          transform = Mat4.identity()
              .times(Mat4.translation([0,300,0]))
              .times(Mat4.rotation(Math.PI/2,Vec.of(1,0,0)))
              .times(Mat4.scale([700,700,0]));
           this.shapes.ground.draw(graphics_state,transform,this.materials.wood);



        }

        draw_firework(graphics_state, t, position) {
            let zero_to_one = 0.5 + 0.5*Math.sin(2 * Math.PI/3*t);
            // let color = Color.of( 1, 1, 1, 1 );

            this.stop_firework = true;
            for(let i = 0; i < 200; i++){
                let color = Color.of( this.random_color[i][0],  this.random_color[i][1],  this.random_color[i][2], 1 );
                let V = this.random_v[i];
                let g = this.random_g[i];
                let x_angle = this.random_x_angle[i];
                let z_angle = this.random_z_angle[i];

                let p_xy = V * Math.cos(x_angle);
                let p_xz = V * Math.cos(z_angle);
                let Vx = p_xy * Math.cos(z_angle);
                let Vy = p_xy * Math.sin(z_angle);
                let Vz = -1 * p_xz * Math.sin(x_angle);


                let X = this.random_direct[i] * Vx* (t - this.fire_time);
                let Y = Vy*(t - this.fire_time) - g*(t - this.fire_time)*(t - this.fire_time)/2;
                let Z = this.random_direct[i] * Vz*(t - this.fire_time);
                if(Y > -5){
                    let transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([X,Y,Z]));
                    transform = transform.times(Mat4.translation(position));
                    transform = transform.times(Mat4.scale([0.5,0.5,0.5]));
                    this.shapes.sphere.draw(graphics_state, transform, this.materials.fire.override({color: color}));
                    this.stop_firework = false;
                }
            }

        }

        draw_dart(graphics_state, t) {
            let x_offset = -19;
            let transform = Mat4.identity();

            if(this.shoot) {
                for (let i = 0; i < 4; i++) {
                    let ang = 1;

                    if (i == 0) ang = 1;
                    else if (i == 1) ang = 1 / 2;
                    else if (i == 2) ang = 1 / 4;
                    else if (i == 3) ang = -1 / 4;

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));


                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 20, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.blue_fire);

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));

                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 20, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.blue_fire);

                }

                for (let j = 0; j < 8; j++) {
                    let ang = 1;

                    if (j == 0) ang = 1 / 8;
                    else if (j == 1) ang = -1 / 8;
                    else if (j == 2) ang = 3 / 8;
                    else if (j == 3) ang = -3 / 8;
                    else if (j == 4) ang = 1 / 16;
                    else if (j == 5) ang = -1 / 16;
                    else if (j == 6) ang = 3 / 16;
                    else if (j == 7) ang = -3 / 16;

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));

                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 10, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.yellow_fire);

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));

                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 10, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.yellow_fire);

                }
            }

            // dart piece 1
            x_offset = -19;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-10,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-10,0,0]));
            transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
            this.dart_view = transform.times(Mat4.translation([-10,3,0]));
            // dart piece 2
            x_offset = -17;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([8,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-8,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([0.5,0.5,4]));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(103/255, 199/255, 235/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 3
            x_offset = -16;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([7,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-7,0,0]));
            transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 4
            x_offset = -12;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([3,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-3,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1,1,6]));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(170/255, 5/255, 5/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 5
            x_offset = -10;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([1,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-1,0,0]));
            transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1.3,1.3,2]));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(103/255, 199/255, 235/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));


            // dart piece 6
            x_offset = -5;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([-4,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([4,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1.3,1.3,6]));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(170/255, 5/255, 5/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 7
            x_offset = 0;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([-9,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([9,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1.3,1.3,2]));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(106/255, 12/255, 11/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 8 (rightmost)
            x_offset = -9;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([10,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1,1,10]));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));



            transform = Mat4.identity();
            // transform = transform.times(Mat4.translation([X,Y,0]));
            // transform = transform.times(Mat4.translation([-20,0,0]));
            // transform = transform.times(Mat4.rotation(cur_angle, Vec.of(0,0,1)));
            // transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            // transform = transform.times(Mat4([2,2,3]);
            // transform = transform.times(Mat4.scale([2,2,3]));
            // this.shapes.wing.draw(graphics_state, transform, this.materials.wing);
        }

        // based on z and y values
        compute_distance(p1, p2) {
            return Math.sqrt((p1[2] - p2[2]) ** 2 + (p1[1] - p2[1]) ** 2);
        }

        // Determine only based on x-axis
        // position can be vec3
        detect_collision(dart_pos, board_pos, board_rad) {
            if(this.collision_computed) return false;

            let x_offset = Math.abs(dart_pos[0] - board_pos[0]);

            if (x_offset <= 2 && this.compute_distance(dart_pos, board_pos) <= board_rad) {
                // collision
                return true;
            }
            return false;
        }

        get_random(){
            this.random_v = [];
            this.random_g = [];
            this.random_color = [];
            this.random_x_angle = [];
            this.random_z_angle = [];
            this.random_direct = [];
            for(let i = 0; i < 500; i++){
                this.random_v.push(Math.ceil(Math.random() * 20) + 10);
                this.random_g.push(Math.ceil(Math.random() * 20) + 10);
                this.random_color.push([Math.random(), Math.random(), Math.random()]);
                this.random_x_angle.push(Math.PI/Math.ceil(Math.random() * 3));
                this.random_z_angle.push(Math.PI/Math.ceil(Math.random() * 3));
                if(Math.random()<0.5) this.random_direct.push(1);
                else this.random_direct.push(-1);
            }
        }

        compute_score(dart_pos, board_pos, board_rad) {

            let z_offset = Math.abs(dart_pos[2] - board_pos[2]);
            let y_offset = Math.abs(dart_pos[1] - board_pos[1]);

            if (z_offset <= board_rad * 0.1 && y_offset <= board_rad * 0.1) {
                console.log("Bulls EYE");

                if (this.level === 1) {
                  this.accel_z = Math.round(Math.random() * (4) + 12);
                  this.level += 1;
                } else if (this.level === 2) {
                  this.accel_z = Math.round(Math.random() * (5) - 25);
                  this.level += 1;
                } else if (this.level === 3) {
                  this.level += 1;
                }

                this.display_bulls_eye_sign = 12;
                this.bulls_eye = true;
                this.get_random();
                this.score = 100;
            } else if (z_offset <= board_rad * 0.3 && y_offset <= board_rad * 0.3) {
                this.score = 70;
            } else if (z_offset <= board_rad * 0.5 && y_offset <= board_rad * 0.5) {
                this.score = 40;
            } else if (z_offset <= board_rad * 0.7 && y_offset <= board_rad * 0.7) {
                this.score = 10;
            } else {
                this.score = 0;
            }

            this.max_socre = Math.max(this.max_socre, this.score);
        }

        decompose_power_x_y_z(power, up_down_angle, left_right_angle) {
            let p_xy = power * Math.cos(left_right_angle);
            let p_xz = power * Math.cos(up_down_angle);
            this.power_x = p_xy * Math.cos(up_down_angle);
            this.power_y = p_xy * Math.sin(up_down_angle);
            this.power_z = -1 * p_xz * Math.sin(left_right_angle);
        }

        apply_accel(dt) {
            this.power_x += this.accel_x * dt;
            this.power_y += this.accel_y * dt;
            this.power_z += this.accel_z * dt;
        }

        update_dart_pos(dt) {
            this.dart_pos[0] += this.power_x * dt;
            this.dart_pos[1] += this.power_y * dt;
            this.dart_pos[2] += this.power_z * dt;
        }

        update_dart_angle() {
            this.up_down_angle = Math.atan(this.power_y / this.power_x);
            this.left_right_angle = -1 * Math.atan(this.power_z / this.power_x);
        }

        draw_board(graphics_state) {

            let transform = Mat4.identity();
            /*transform = transform.times(Mat4.translation([105,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([80,80,0]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.wood);*/

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([100,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,50,0]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.board);
        }

        draw_flag(graphics_state) {
            let flag_loc;
            let flag_rot;
            let flag_x = 300;
            let flag_y = -50;
            let flag_z = -200;
            if (this.accel_z > 0) {
                flag_loc = [flag_x, flag_y, 0 + flag_z];
                flag_rot = 0;
            } else {
                flag_loc = [flag_x, flag_y,-80 + flag_z];
                flag_rot = Math.PI;
            }

            let flag_transform = Mat4.identity()
                .times(Mat4.translation(flag_loc))
                .times(Mat4.rotation(flag_rot, Vec.of(0,1,0)))
                .times(Mat4.rotation(Math.PI, Vec.of(1,0,0))) // upside down
                .times(Mat4.rotation(Math.PI / 2, Vec.of(0,1,0))) // same direction with the board
                .times(Mat4.scale([40,40,40]));

            let stick_transform = Mat4.identity()
                .times(Mat4.translation([flag_x,flag_y-10,-40 + flag_z]))
                .times(Mat4.scale([1,20,0.1]));

            let tent_transform = Mat4.identity()
              .times(Mat4.translation([flag_x,flag_y-54,-20 + flag_z-20]))
              .times(Mat4.scale([0,40,40]));

            this.shapes.bar.draw(graphics_state, stick_transform, this.materials.bar);
            this.shapes.flag.draw(graphics_state, flag_transform, this.materials.flag.override({ wind: this.accel_z } ) );
            this.shapes.bar.draw(graphics_state, tent_transform, this.materials.carnival_tent);
        }

        update_stat() {
            // look up the elements we want to affect
            document.getElementById("score").innerText = this.score.toFixed(2).toString();
            document.getElementById("max_score").innerText = this.max_socre.toFixed(2).toString();
            document.getElementById("power").innerText = this.power.toFixed(2).toString();
            document.getElementById("wind").innerText = this.accel_z.toFixed(2).toString();
            document.getElementById("up_down_angle").innerText = (this.up_down_angle * 180 / Math.PI).toFixed(2).toString(2);
            document.getElementById("left_right_angle").innerText = (this.left_right_angle * 180 / Math.PI).toFixed(2).toString(2);
        }

        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

            // charging
            if (this.charging) {
                this.power =  this.max_power * 0.5 * (Math.sin((t-this.charging_start_time) - 0.5 * Math.PI) + 1);
            } else {
                this.curr_time = t;
            }

            // set up the power charging bar
            // this.set_bar_transform();
            // this.shapes.bar.draw(graphics_state, this.bar_transform, this.materials.bar);

            if(this.shoot){
                this.apply_accel(dt);
                this.update_dart_pos(dt);
                this.update_dart_angle();
            } else {
                // when key pressed, adjust angle
                this.set_angle();
            }

            //firework
            if(this.bulls_eye) {
                this.fire_time = t;
                this.bulls_eye = false;
            }
            if(this.fire_time != 0){
                this.draw_firework(graphics_state, t, [40, 40, -40]);
                this.draw_firework(graphics_state, t, [70, 10, -60]);
                this.draw_firework(graphics_state, t, [90, 30, 40]);
                this.draw_firework(graphics_state, t, [40, 20, 70]);
                this.draw_firework(graphics_state, t, [80, -20, -10]);
                if(this.stop_firework) {
                    this.get_random();
                    this.fire_time = t;
                }
            }

            //draw five gray fabrics
            this.draw_background(graphics_state);

            // draw the dart that consists of 9 pieces
            this.draw_dart(graphics_state, t);
            // draw the board
            this.draw_board(graphics_state);

            //console.log(this.dart_pos);
            if (this.detect_collision(this.dart_pos, this.board_pos, 50)) {
                console.log("Detected Collision");
                this.shoot = false;
                this.compute_score(this.dart_pos, this.board_pos, 50);
                this.collision_computed = true;
            }

            // flag
            this.draw_flag(graphics_state);

            // set camera if necessary
            if (this.attached !== undefined) {
                graphics_state.camera_transform = Mat4.translation([0,0,-5]).times(Mat4.inverse(this.attached()))
                    .map( (x, i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 0.1 ));
            }

            this.update_stat();

            if (this.display_bulls_eye_sign > 0) {
              // show sign after 2 seconds buffer
              if (this.display_bulls_eye_sign > 7) {
                document.getElementById("bull_img").style.display = 'inline';
                document.getElementById("bull_font").style.display = "inline";
              } else {
                document.getElementById("bull_img").style.display = "none";
                document.getElementById("bull_font").style.display = "none";

                if (this.level === 2) {
                  document.getElementById("levelup").innerText =
                      "Unlocked Level 2! \nEast Wind with speed "+ this.accel_z.toString();
                  document.getElementById("levelup").style.display = "inline";
                } else if (this.level === 3) {
                  document.getElementById("levelup").innerText =
                      "Unlocked Level 3! \nWest Wind with speed " + Math.abs(this.accel_z).toString();
                  document.getElementById("levelup").style.display = "inline";
                } else if (this.level === 4) {
                  document.getElementById("allclear").style.display = "inline";
                  document.getElementById("mouse_trap").style.display = "inline";
                }
                if (this.display_bulls_eye_sign < 2) {
                  this.restart();
                }
              }
              this.display_bulls_eye_sign -= dt;
            } else {
              document.getElementById("bull_img").style.display="none";
              document.getElementById("bull_font").style.display="none";
              document.getElementById("levelup").style.display="none";

              /* document.getElementById("allclear").style.display="none";*/
              /* document.getElementById("mouse_trap").style.display = "none";*/
            }
        }
    };

class Flag_Shader extends Phong_Shader
{

    material( color, properties )     // Define an internal class "Material" that stores the standard settings found in Phong lighting.
    {
        return new class Material       // Possible properties: ambient, diffusivity, specularity, smoothness, gouraud, texture.
    { constructor( shader, color = Color.of( 0,0,0,1 ), ambient = 0, diffusivity = 1, specularity = 1, smoothness = 40, wind= 5.0)
    { Object.assign( this, { shader, color, ambient, diffusivity, specularity, smoothness, wind } );  // Assign defaults.
        Object.assign( this, properties );                                                        // Optionally override defaults.
    }
        override( properties )                      // Easily make temporary overridden versions of a base material, such as
        { const copied = new this.constructor();  // of a different color or diffusivity.  Use "opacity" to override only that.
            Object.assign( copied, this );
            Object.assign( copied, properties );
            copied.color = copied.color.copy();
            if( properties[ "opacity" ] != undefined ) copied.color[3] = properties[ "opacity" ];
            return copied;
        }
    }( this, color );
    }

    update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
    {
        // First, send the matrices to the GPU, additionally cache-ing some products of them we know we'll need:
        this.update_matrices( g_state, model_transform, gpu, gl );
        gl.uniform1f ( gpu.animation_time_loc, g_state.animation_time / 1000 );

        if( g_state.gouraud === undefined ) { g_state.gouraud = g_state.color_normals = false; }    // Keep the flags seen by the shader
        gl.uniform1i( gpu.GOURAUD_loc,        g_state.gouraud || material.gouraud );                // program up-to-date and make sure
        gl.uniform1i( gpu.COLOR_NORMALS_loc,  g_state.color_normals );                              // they are declared.

        gl.uniform4fv( gpu.shapeColor_loc,     material.color       );    // Send the desired shape-wide material qualities
        gl.uniform1f ( gpu.ambient_loc,        material.ambient     );    // to the graphics card, where they will tweak the
        gl.uniform1f ( gpu.diffusivity_loc,    material.diffusivity );    // Phong lighting formula.
        gl.uniform1f ( gpu.specularity_loc,    material.specularity );
        gl.uniform1f ( gpu.smoothness_loc,     material.smoothness  );
        gl.uniform1f ( gpu.wind_loc,           material.wind  );

        if( material.texture )                           // NOTE: To signal not to draw a texture, omit the texture parameter from Materials.
        { gpu.shader_attributes["tex_coord"].enabled = true;
            gl.uniform1f ( gpu.USE_TEXTURE_loc, 1 );
            gl.bindTexture( gl.TEXTURE_2D, material.texture.id );
        }
        else  { gl.uniform1f ( gpu.USE_TEXTURE_loc, 0 );   gpu.shader_attributes["tex_coord"].enabled = false; }

        if( !g_state.lights.length )  return;
        var lightPositions_flattened = [], lightColors_flattened = [], lightAttenuations_flattened = [];
        for( var i = 0; i < 4 * g_state.lights.length; i++ )
        { lightPositions_flattened                  .push( g_state.lights[ Math.floor(i/4) ].position[i%4] );
            lightColors_flattened                     .push( g_state.lights[ Math.floor(i/4) ].color[i%4] );
            lightAttenuations_flattened[ Math.floor(i/4) ] = g_state.lights[ Math.floor(i/4) ].attenuation;
        }
        gl.uniform4fv( gpu.lightPosition_loc,       lightPositions_flattened );
        gl.uniform4fv( gpu.lightColor_loc,          lightColors_flattened );
        gl.uniform1fv( gpu.attenuation_factor_loc,  lightAttenuations_flattened );
    }

    shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
        const int N_LIGHTS = 2;             // We're limited to only so many inputs in hardware.  Lights are costly (lots of sub-values).
        uniform float ambient, diffusivity, specularity, smoothness, animation_time, attenuation_factor[N_LIGHTS], wind;
        uniform bool GOURAUD, COLOR_NORMALS, USE_TEXTURE;               // Flags for alternate shading methods
        uniform vec4 lightPosition[N_LIGHTS], lightColor[N_LIGHTS], shapeColor;
        varying vec3 N, E;                    // Specifier "varying" means a variable's final value will be passed from the vertex shader 
        varying vec2 f_tex_coord;             // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the 
        varying vec4 VERTEX_COLOR;            // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 L[N_LIGHTS], H[N_LIGHTS];
        varying float dist[N_LIGHTS];
        varying float varSlope;
        `;
    }

    vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos, normal;
        attribute vec2 tex_coord;

        uniform mat4 camera_transform, camera_model_transform, projection_camera_model_transform;
        uniform mat3 inverse_transpose_modelview;

        void main()
        {   
          // FLAG Movement
          f_tex_coord = tex_coord;                                                           // Directly use original texture coords and interpolate between.          

          float x = tex_coord.x;
          float y = tex_coord.y;
          float t = abs(wind) * -1.0 * animation_time; // this contant value should be the power of wind
        
          float h = cos( t + x * 10.0 );
          h += cos( x * 3.0 - t * 0.1751 );
          y += h * x * 0.2;
                
          // compute slope
          float x2 = x - 0.001;
          float h2 = cos( t + x2 * 10.0 );
          h2 += cos( x2 * 3.0 - t * 0.1751 );
          varSlope = h - h2;
        
          gl_Position = projection_camera_model_transform * vec4( 2.0 * x - 1.0, 0.5 - y, 0.0, 1.0 );

        }`;
    }

    fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    {
        return `
        
        uniform sampler2D texture;

        void main()
        {
              // vec4 tex_color = vec4(0.73,0.41,0.01,1);
              vec4 tex_color = texture2D( texture, f_tex_coord);                         // Sample the texture image in the correct place.
              if( varSlope > 0.0 ) {
                tex_color = mix( tex_color, vec4(0,0,0,1), varSlope * 50.0 );
              }
              if( varSlope < 0.0 ) {
                tex_color = mix( tex_color, vec4(1,1,1,1), abs(varSlope) * 50.0 );
              }
              gl_FragColor = tex_color;
        }`;
    }
}

/*tester */
window.Test_Scene = window.classes.Test_Scene = class Test_Scene extends Scene_Component {
      constructor(context, control_box)
      {
        // The scene begins by requesting the camera, shapes, and materials it will need.
        super(context, control_box);
        // First, include a secondary Scene that provides movement controls:
        if (!context.globals.has_controls)
          context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 100), Vec.of(0, 0, 0), Vec.of(0, 1, 0));

        this.initial_camera_location = Mat4.identity()
            .times(Mat4.translation([-130,5,-10]))
            .times(Mat4.rotation(Math.PI/-2, [0,1,0]));

        context.globals.graphics_state.camera_transform = Mat4.inverse(this.initial_camera_location);

        const r = context.width / context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        const shapes = {
          bar: new Cube(),
          cylinder: new Rounded_Capped_Cylinder(15,15,[2,2]),
          cone : new Closed_Cone(15, 15, [2,2]),
          flag: new Flag2(201),
          wing: new Windmill(4),
          wood: new Cube(),
          background_wall: new Cube(),
          beer: new Cylindrical_Tube(15, 15, [20,20]),
          triangle: new Triangle(),
          ground: new Cube(),
          sphere: new Subdivision_Sphere(4),
        };

        shapes.background_wall.texture_coords = shapes.background_wall.texture_coords.map(v => Vec.of(v[0] * 6, v[1] * 6));
        shapes.ground.texture_coords = shapes.ground.texture_coords.map(v => Vec.of(v[0] * 40, v[1] * 20));

        this.submit_shapes(context, shapes);

        // Make some Material objects available to you:
        this.materials =
            {
              bar : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1}),
              dart : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 0.5, specularity: 1}),
              cone : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
              wing : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
              board: context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/dart_board.png", true)}),
              beer : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/heineken.png", true)}),
              flag: context.get_instance(Flag_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/flag.png", true)}),
              fire : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1, specularity: 1}),
              blue_fire : context.get_instance(Phong_Shader).material(Color.of(44/255,83/255,143/255,1), {ambient: 1, diffusivity: 1,}),
              yellow_fire : context.get_instance(Phong_Shader).material(Color.of(1,189/255,46/255,1), {ambient: 1, diffusivity: 1,}),
              fabric : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/classic.jpg", true)}),
              table_wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/table_wood.jpg", true)}),
              wood_tile : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/high_res_wood_tile.jpg", true)}),
              wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/wood.png", true)}),
              white_wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/table_wood.jpg", true)}),
              brick : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/brick.jpg", true)}),
              marvel : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/fun.jpg", true)}),
              silk : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/silk_fabric.jpg", true)}),
              toystory : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/behind_dart.jpg", true)}),
              photo_frame : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1}),
              funhouse : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/funhouse.jpg", true)}),
              carnival_tent : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/carnival_tent.png", true)}),
            };

        this.lights = [new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
          new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
          new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
          new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
          new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)];

        // physics variables
        this.max_power = 200;
        this.power = 0;
        this.power_x = 0;
        this.power_y = 0;
        this.power_z = 0;

        this.accel_x = 0.0;
        this.accel_y = -9.8; // gravity
        this.accel_z = 5.0;

        // 0 ~ 90 (up down), -90 ~ 90 (left right)
        this.up_down_angle = 0;
        this.left_right_angle = 0;

        // conditional variables
        this.charging = false;
        this.shoot = false;
        this.collision_computed = false;
        this.angle_up_start = false;
        this.angle_down_start = false;
        this.angle_left_start = false;
        this.angle_right_start = false;
        this.bulls_eye = false;
        this.stop_firework = true;
        this.fire_time = 0;

        //random firework
        this.random_v = [];
        this.random_g = [];
        this.random_color = [];
        this.random_x_angle = [];
        this.random_z_angle = [];
        this.random_direct = [];

        this.get_random();

        // time
        this.charging_start_time = 0;
        this.curr_time = 0;

        // transform: dart, board, power bar
        this.default_dart_pos = [-100 ,0, 0]; // default (based on the rightmost piece)
        this.dart_pos = [-100 ,0, 0]; // current dart posi1tion
        this.board_pos = [100,0,0]; // default
        this.bar_transform = Mat4.identity().times(Mat4.translation([10,0,0]));

        this.front_view = Mat4.identity()
            .times(Mat4.translation([-120,0,0]))
            .times(Mat4.rotation(-1*Math.PI/2, Vec.of(0,1,0)));

        this.score = 0;
        this.max_socre = 0;
      }

      make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Charge", ["Enter"], this.start_charging,"#173885", this.start_shoot);
        this.key_triggered_button("Angle Up", ["i"], this.angle_up, "#F2337B", this.angle_up_release);
        this.key_triggered_button("Angle Down", ["k"], this.angle_down,"#F6D003", this.angle_down_release);
        this.key_triggered_button("Angle Left", ["j"], this.angle_left,"#077DDF", this.angle_left_release);
        this.key_triggered_button("Angle Right", ["l"], this.angle_right,"#F60E26", this.angle_right_release);
        this.new_line();
        this.key_triggered_button("Restart", ["q"], this.restart,"#872E8C");
        this.key_triggered_button("Front View", ["1"], ()=>this.attached=()=> this.front_view, "#D72630");
        this.key_triggered_button("Side View", ["2"],  ()=>this.attached=()=> this.initial_camera_location, "#D7D52A");
        this.key_triggered_button("Water View", ["/"],  ()=>this.attached=()=> this.dart_view, "#F28A17");
      }

      start_charging() {
        console.log("Start charging");
        this.charging = true;
        this.shoot = false;
        this.charging_start_time = this.curr_time;
      }

      /* Key Event Handlers */
      start_shoot() {
        console.log("Shoot!");
        console.log(this.power);
        this.charging = false;
        this.shoot = true;
        this.decompose_power_x_y_z(this.power, this.up_down_angle, this.left_right_angle);
      }

      angle_up() {
        if (!this.angle_down_start) {
          this.angle_up_start = true;
        }
      }

      angle_up_release() {
        this.angle_up_start = false;
      }

      angle_down() {
        if (!this.angle_up_start) {
          this.angle_down_start = true;
        }
      }

      angle_down_release() {
        this.angle_down_start = false;
      }

      angle_left() {
        if (!this.angle_right_start) {
          this.angle_left_start = true;
        }
      }

      angle_left_release() {
        this.angle_left_start = false;
      }

      angle_right() {
        if (!this.angle_left_start) {
          this.angle_right_start = true;
        }
      }

      angle_right_release() {
        this.angle_right_start = false;
      }

      set_angle() {
        let one_move = Math.PI / 180;
        if (this.angle_up_start && this.up_down_angle < Math.PI/2) {
          this.up_down_angle += one_move;
        } else if (this.angle_down_start && this.up_down_angle > 0) {
          this.up_down_angle -= one_move;
        }

        if (this.angle_left_start && this.left_right_angle < Math.PI/2) {
          this.left_right_angle += one_move;
        } else if (this.angle_right_start && this.left_right_angle > -1* Math.PI/2) {
          this.left_right_angle -= one_move;
        }
      }

      set_bar_transform() {
        this.bar_transform = Mat4.identity()
            .times(Mat4.scale([1,10*(this.power/this.max_power),1]))
            .times(Mat4.translation([10,0,0]))
      }

      restart() {
        this.power = 0;
        this.left_right_angle = 0;
        this.up_down_angle = 0;

        // conditional variables
        this.charging = false;
        this.shoot = false;
        this.angle_up_start = false;
        this.angle_down_start = false;
        this.angle_left_start = false;
        this.angle_right_start = false;
        this.collision_computed = false;
        this.fire_time = 0;

        // transform: dart, board, power bar
        this.dart_pos = [-100,0,0]; // current dart position
        this.bar_transform = Mat4.identity().times(Mat4.translation([10,0,0]));
      }

      draw_water(graphics_state, t) {
        let x_offset = -19;
        let transform = Mat4.identity();

        if(this.shoot) {
          for (let i = 0; i < 4; i++) {
            let ang = 1;

            if (i == 0) ang = 1;
            else if (i == 1) ang = 1 / 2;
            else if (i == 2) ang = 1 / 4;
            else if (i == 3) ang = -1 / 4;

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10, 0, 0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.translation([-10, 0, 0]));


            transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
            transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

            transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.scale([1, 20, 1]));
            this.shapes.triangle.draw(graphics_state, transform, this.materials.blue_fire);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10, 0, 0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.translation([-10, 0, 0]));

            transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
            transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

            transform = transform.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)));
            transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.scale([1, 20, 1]));
            this.shapes.triangle.draw(graphics_state, transform, this.materials.blue_fire);

          }

          for (let j = 0; j < 8; j++) {
            let ang = 1;

            if (j == 0) ang = 1 / 8;
            else if (j == 1) ang = -1 / 8;
            else if (j == 2) ang = 3 / 8;
            else if (j == 3) ang = -3 / 8;
            else if (j == 4) ang = 1 / 16;
            else if (j == 5) ang = -1 / 16;
            else if (j == 6) ang = 3 / 16;
            else if (j == 7) ang = -3 / 16;

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10, 0, 0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.translation([-10, 0, 0]));

            transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
            transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

            transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.scale([1, 10, 1]));
            this.shapes.triangle.draw(graphics_state, transform, this.materials.yellow_fire);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10, 0, 0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.translation([-10, 0, 0]));

            transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
            transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

            transform = transform.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)));
            transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
            transform = transform.times(Mat4.scale([1, 10, 1]));
            this.shapes.triangle.draw(graphics_state, transform, this.materials.yellow_fire);

          }
        }

        // dart piece 1
        x_offset = -19;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([10,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([-10,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([10,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([-10,0,0]));
        transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
        this.dart_view = transform.times(Mat4.translation([-10,3,0]));
        // dart piece 2
        x_offset = -17;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([8,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([-8,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([0.5,0.5,4]));
        this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(103/255, 199/255, 235/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

        // dart piece 3
        x_offset = -16;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([7,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([-7,0,0]));
        transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
        this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

        // dart piece 4
        x_offset = -12;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([3,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([-3,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([1,1,6]));
        this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(170/255, 5/255, 5/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

        // dart piece 5
        x_offset = -10;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([1,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([-1,0,0]));
        transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([1.3,1.3,2]));
        this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(103/255, 199/255, 235/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));


        // dart piece 6
        x_offset = -5;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([-4,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([4,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([1.3,1.3,6]));
        this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(170/255, 5/255, 5/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

        // dart piece 7
        x_offset = 0;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.translation([-9,0,0]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([9,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([1.3,1.3,2]));
        this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(106/255, 12/255, 11/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

        // dart piece 8 (rightmost)
        x_offset = -9;
        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
        transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
        transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
        transform = transform.times(Mat4.translation([10,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([1,1,10]));
        this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));



        transform = Mat4.identity();
        // transform = transform.times(Mat4.translation([X,Y,0]));
        // transform = transform.times(Mat4.translation([-20,0,0]));
        // transform = transform.times(Mat4.rotation(cur_angle, Vec.of(0,0,1)));
        // transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        // transform = transform.times(Mat4([2,2,3]);
        // transform = transform.times(Mat4.scale([2,2,3]));
        // this.shapes.wing.draw(graphics_state, transform, this.materials.wing);
      }

      // based on z and y values
      compute_distance(p1, p2) {
        return Math.sqrt((p1[2] - p2[2]) ** 2 + (p1[1] - p2[1]) ** 2);
      }

      // Determine only based on x-axis
      // position can be vec3
      detect_collision(dart_pos, board_pos, board_rad) {
        if(this.collision_computed) return false;

        let x_offset = Math.abs(dart_pos[0] - board_pos[0]);

        if (x_offset <= 2 && this.compute_distance(dart_pos, board_pos) <= board_rad) {
          // collision
          return true;
        }
        return false;
      }

      get_random(){
        this.random_v = [];
        this.random_g = [];
        this.random_color = [];
        this.random_x_angle = [];
        this.random_z_angle = [];
        this.random_direct = [];
        for(let i = 0; i < 500; i++){
          this.random_v.push(Math.ceil(Math.random() * 20) + 10);
          this.random_g.push(Math.ceil(Math.random() * 20) + 10);
          this.random_color.push([Math.random(), Math.random(), Math.random()]);
          this.random_x_angle.push(Math.PI/Math.ceil(Math.random() * 3));
          this.random_z_angle.push(Math.PI/Math.ceil(Math.random() * 3));
          if(Math.random()<0.5) this.random_direct.push(1);
          else this.random_direct.push(-1);
        }
      }

      compute_score(dart_pos, board_pos, board_rad) {

        let z_offset = Math.abs(dart_pos[2] - board_pos[2]);
        let y_offset = Math.abs(dart_pos[1] - board_pos[1]);

        if (z_offset <= board_rad * 0.1 && y_offset <= board_rad * 0.1) {
          console.log("Bulls EYE");
          this.bulls_eye = true;
          this.get_random();
          this.score = 100;
        } else if (z_offset <= board_rad * 0.3 && y_offset <= board_rad * 0.3) {
          this.score = 70;
        } else if (z_offset <= board_rad * 0.5 && y_offset <= board_rad * 0.5) {
          this.score = 40;
        } else if (z_offset <= board_rad * 0.7 && y_offset <= board_rad * 0.7) {
          this.score = 10;
        } else {
          this.score = 0;
        }

        this.max_socre = Math.max(this.max_socre, this.score);
      }

      decompose_power_x_y_z(power, up_down_angle, left_right_angle) {
        let p_xy = power * Math.cos(left_right_angle);
        let p_xz = power * Math.cos(up_down_angle);
        this.power_x = p_xy * Math.cos(up_down_angle);
        this.power_y = p_xy * Math.sin(up_down_angle);
        this.power_z = -1 * p_xz * Math.sin(left_right_angle);
      }

      apply_accel(dt) {
        this.power_x += this.accel_x * dt;
        this.power_y += this.accel_y * dt;
        this.power_z += this.accel_z * dt;
      }

      update_dart_pos(dt) {
        this.dart_pos[0] += this.power_x * dt;
        this.dart_pos[1] += this.power_y * dt;
        this.dart_pos[2] += this.power_z * dt;
      }

      update_dart_angle() {
        this.up_down_angle = Math.atan(this.power_y / this.power_x);
        this.left_right_angle = -1 * Math.atan(this.power_z / this.power_x);
      }

      draw_board(graphics_state) {

        let transform = Mat4.identity();
        /*transform = transform.times(Mat4.translation([105,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([80,80,0]));
        this.shapes.bar.draw(graphics_state, transform, this.materials.wood);*/

        transform = Mat4.identity();
        transform = transform.times(Mat4.translation([100,0,0]));
        transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        transform = transform.times(Mat4.scale([50,50,0]));
        this.shapes.bar.draw(graphics_state, transform, this.materials.board);
      }

      update_stat() {
        // look up the elements we want to affect
        document.getElementById("score").innerText = this.score.toFixed(2).toString();
        document.getElementById("max_score").innerText = this.max_socre.toFixed(2).toString();
        document.getElementById("power").innerText = this.power.toFixed(2).toString();
        document.getElementById("wind").innerText = this.accel_z.toFixed(2).toString();
        document.getElementById("up_down_angle").innerText = (this.up_down_angle * 180 / Math.PI).toFixed(2).toString(2);
        document.getElementById("left_right_angle").innerText = (this.left_right_angle * 180 / Math.PI).toFixed(2).toString(2);
      }

      display(graphics_state) {
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        // charging
        if (this.charging) {
          this.power =  this.max_power * 0.5 * (Math.sin((t-this.charging_start_time) - 0.5 * Math.PI) + 1);
        } else {
          this.curr_time = t;
        }

        // set up the power charging bar
        // this.set_bar_transform();
        // this.shapes.bar.draw(graphics_state, this.bar_transform, this.materials.bar);

        if(this.shoot){
          this.apply_accel(dt);
          this.update_dart_pos(dt);
          this.update_dart_angle();
        } else {
          // when key pressed, adjust angle
          this.set_angle();
        }

        //firework
        if(this.bulls_eye) {
          this.fire_time = t;
          this.bulls_eye = false;
        }
        if(this.fire_time != 0){
          this.draw_firework(graphics_state, t, [40, 40, -40]);
          this.draw_firework(graphics_state, t, [70, 10, -60]);
          this.draw_firework(graphics_state, t, [90, 30, 40]);
          this.draw_firework(graphics_state, t, [40, 20, 70]);
          this.draw_firework(graphics_state, t, [80, -20, -10]);
          if(this.stop_firework) {
            this.get_random();
            this.fire_time = t;
          }
        }

        // draw the dart that consists of 9 pieces
        this.draw_water(graphics_state, t);
        // draw the board
        this.draw_board(graphics_state);

        //console.log(this.dart_pos);
        if (this.detect_collision(this.dart_pos, this.board_pos, 50)) {
          console.log("Detected Collision");
          this.shoot = false;
          this.compute_score(this.dart_pos, this.board_pos, 50);
          this.collision_computed = true;
        }

        // set camera if necessary
        if (this.attached !== undefined) {
          graphics_state.camera_transform = Mat4.translation([0,0,-5]).times(Mat4.inverse(this.attached()))
              .map( (x, i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 0.1 ));
        }

        this.update_stat();
      }
    };